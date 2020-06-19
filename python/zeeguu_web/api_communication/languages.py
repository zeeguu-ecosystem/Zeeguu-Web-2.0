from flask import json

from zeeguu_web.api_communication.api_connection import get

AVAILABLE_LANGUAGES = "available_languages"
AVAILABLE_NATIVE_LANGUAGES = "available_native_languages"


def get_available_languages():
    resp = get(AVAILABLE_LANGUAGES)
    _json = json.loads(resp.content)
    return _json


def get_available_native_languages():
    resp = get(AVAILABLE_NATIVE_LANGUAGES)
    _json = json.loads(resp.content)
    return _json
