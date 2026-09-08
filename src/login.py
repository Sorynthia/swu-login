"""Run the SWU login flow and collect credentials interactively."""

from __future__ import annotations

import getpass
import json
import sys

import requests

from swu_auth import LoginClient, LoginError, Settings


def main() -> int:
    try:
        username = input("Username: ").strip()
        password = getpass.getpass("Password: ")
        client = LoginClient(settings=Settings())
        client.initialize()
        captcha_path = client.download_captcha()
        print(f"Captcha saved to: {captcha_path.resolve()}")
        verify_code = input("Captcha: ").strip()
        result = client.login(username, password, verify_code)
    except (ValueError, LoginError) as exc:
        print(f"Login flow failed: {exc}", file=sys.stderr)
        return 3
    except requests.RequestException as exc:
        print(f"Network request failed: {exc}", file=sys.stderr)
        return 2
    except (EOFError, KeyboardInterrupt):
        print("\nCancelled", file=sys.stderr)
        return 130

    print(json.dumps(result, ensure_ascii=False, indent=2))
    if result.get("code") == 200:
        print("Login succeeded")
        print(json.dumps({"cookies": client.cookies()}, ensure_ascii=False))
        return 0

    print(f"Login rejected: code={result.get('code')} msg={result.get('msg')}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
