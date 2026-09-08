from swu_auth.client import LoginClient, build_login_payload
from swu_auth.config import Settings


def test_login_page_is_built_from_settings():
    settings = Settings(
        server="https://example.test/center-auth-server",
        service="https://example.test/app/cas?x=1",
        application="demo",
    )
    client = LoginClient(settings=settings)
    assert client.login_page == (
        "https://example.test/center-auth-server/demo/cas/login?service="
        "https%3A%2F%2Fexample.test%2Fapp%2Fcas%3Fx%3D1"
    )


def test_payload_contains_protocol_fields():
    payload = build_login_payload("alice", "secret", "A1B2", university_id="42")
    assert payload["name"] == "alice"
    assert payload["verifyCode"] == "A1B2"
    assert payload["universityId"] == "42"
    assert payload["loginType"] == "login"
    assert payload["pwd"]
