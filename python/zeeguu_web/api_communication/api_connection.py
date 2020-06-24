import flask
import requests
from flask import json
from zeeguu_web.constants import KEY__SESSION_ID


class APIException(Exception):
    """
    Exception for signalling something went wrong while communication with the API
    """

    def __init__(self, message):
        super()
        self.message = message


def _check_response(response):
    """
    Given a response from the API this function checks if the status code is valid.

    If the status code is above 400 a APIException is thrown.

    :param response:
    :return:
    """
    if response.status_code >= 400:
        try:
            # We can't depend on the API always providing a default message
            data = json.loads(response.text)["message"]
        except Exception as ex:
            data = response.reason
        finally:
            raise APIException(data)
    else:
        return response


def _api_path(path):
    from zeeguu_web.app import ZEEGUU_API

    if ZEEGUU_API.endswith("/"):
        return ZEEGUU_API + path
    return ZEEGUU_API + "/" + path


def _api_call(function, path, payload={}, params={}, session_needed=False, session=None):
    if session_needed:
        if session is None:
            session_id = flask.session[KEY__SESSION_ID]
        else:
            session_id = session
        params["session"] = session_id
    try:
        if function == "post":
            resp = requests.post(_api_path(path), data=payload, params=params)
        else:
            _path = _api_path(path)
            resp = requests.get(_path, data=payload, params=params)
    except Exception:
        import traceback
        print(traceback.format_exc())
        raise APIException("Exception while performing request.")
    return _check_response(resp)


def post(path, payload={}, params={}, session_needed=False, session=None):
    return _api_call("post", path, payload, params, session_needed, session)


def get(path, payload={}, params={}, session_needed=False, session=None):
    return _api_call("get", path, payload, params, session_needed, session)
