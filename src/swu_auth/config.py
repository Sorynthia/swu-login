"""Configuration for the unified identity login client."""

from __future__ import annotations

from dataclasses import dataclass


DEFAULT_SERVER = "https://ywtb.swu.edu.cn/center-auth-server"
DEFAULT_SERVICE = "https://ywtb.swu.edu.cn/business-center-front/casPlusClient/auth"
DEFAULT_APPLICATION = "officeHallApplicationCode"
DEFAULT_UNIVERSITY_ID = "106350"
DEFAULT_LOGIN_TYPE = "login"
DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36 Edg/152.0.0.0"
)


@dataclass(frozen=True, slots=True)
class Settings:
    """Deployment settings edited in this file."""

    server: str = DEFAULT_SERVER
    service: str = DEFAULT_SERVICE
    application: str = DEFAULT_APPLICATION
    university_id: str = DEFAULT_UNIVERSITY_ID
    login_type: str = DEFAULT_LOGIN_TYPE
    timeout: float = 20.0
    user_agent: str = DEFAULT_USER_AGENT

    def __post_init__(self) -> None:
        object.__setattr__(self, "server", self.server.rstrip("/"))
        if self.timeout <= 0:
            raise ValueError("timeout must be greater than zero")
