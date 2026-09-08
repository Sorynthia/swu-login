"""HTTP client for the SWU unified identity center."""

from __future__ import annotations

import secrets
from pathlib import Path
from typing import Any
from urllib.parse import quote, urlsplit

import requests

from .config import Settings
from .crypto import encrypt_password


class LoginError(RuntimeError):
    """Raised when the server response cannot be used as a login response."""


def build_login_payload(
    username: str,
    password: str,
    verify_code: str,
    *,
    university_id: str,
    login_type: str = "login",
) -> dict[str, str]:
    """Build the JSON body accepted by ``/sso/doLogin``."""

    if not username.strip():
        raise ValueError("username cannot be empty")
    if not password.strip():
        raise ValueError("password cannot be empty")
    if not verify_code.strip():
        raise ValueError("verify_code cannot be empty")
    return {
        "name": username.strip(),
        "pwd": encrypt_password(password),
        "verifyCode": verify_code.strip(),
        "universityId": university_id,
        "loginType": login_type,
    }


class LoginClient:
    """Stateful session that keeps the captcha and login cookies together."""

    def __init__(self, settings: Settings | None = None, session: requests.Session | None = None) -> None:
        self.settings = settings or Settings()
        self.session = session or requests.Session()
        self.session.headers.update({
            "User-Agent": self.settings.user_agent,
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        })

    @property
    def login_page(self) -> str:
        return (
            f"{self.settings.server}/{self.settings.application}/cas/login?service="
            f"{quote(self.settings.service, safe='')}"
        )

    @property
    def origin(self) -> str:
        parsed = urlsplit(self.settings.server)
        return f"{parsed.scheme}://{parsed.netloc}"

    def initialize(self) -> None:
        response = self.session.get(
            self.login_page,
            headers={"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
            timeout=self.settings.timeout,
        )
        response.raise_for_status()
        if "html" not in response.headers.get("Content-Type", "").lower():
            raise LoginError(f"login page returned {response.headers.get('Content-Type', 'unknown')}")

    def download_captcha(self, path: str | Path = "captcha.png") -> Path:
        output = Path(path)
        response = self.session.get(
            f"{self.settings.server}/getVerifyCode",
            params={"random": secrets.randbelow(10**16) / 10**16},
            headers={"Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8"},
            timeout=self.settings.timeout,
        )
        response.raise_for_status()
        if not response.content.startswith(b"\x89PNG"):
            raise LoginError(f"captcha endpoint returned {response.headers.get('Content-Type', 'unknown')}")
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(response.content)
        return output

    def login(self, username: str, password: str, verify_code: str) -> dict[str, Any]:
        payload = build_login_payload(
            username,
            password,
            verify_code,
            university_id=self.settings.university_id,
            login_type=self.settings.login_type,
        )
        response = self.session.post(
            f"{self.settings.server}/sso/doLogin",
            json=payload,
            headers={
                "Accept": "*/*",
                "Content-Type": "application/json, application/json;charset=UTF-8",
                "Origin": self.origin,
                "Referer": self.login_page,
            },
            timeout=self.settings.timeout,
        )
        response.raise_for_status()
        try:
            result = response.json()
        except ValueError as exc:
            raise LoginError(f"login endpoint returned non-JSON: {response.text[:300]}") from exc
        if not isinstance(result, dict):
            raise LoginError(f"unexpected login response: {result!r}")
        return result

    def cookies(self) -> dict[str, str]:
        """Return a copy suitable for passing to another requests client."""

        return self.session.cookies.get_dict().copy()
