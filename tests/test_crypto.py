import base64
import json
from urllib.parse import unquote

from swu_auth.crypto import encrypt_password, split_like_browser


def test_split_matches_common_js_off_by_one():
    assert [29] == list(map(len, split_like_browser("a" * 29)))
    assert [29, 1] == list(map(len, split_like_browser("a" * 30)))
    assert [29, 30, 2] == list(map(len, split_like_browser("a" * 61)))


def test_empty_password_matches_frontend():
    assert encrypt_password("") == ""
    assert encrypt_password("   ") == ""


def test_password_is_url_encoded_rsa_block_array():
    encoded = encrypt_password("a" * 61)
    blocks = json.loads(unquote(encoded))
    assert len(blocks) == 3
    assert all(len(base64.b64decode(block)) == 128 for block in blocks)
