import functools
import flask
from flask import request
from zeeguu_reader.zeeguu_server import ZEEGUU_LOGIN


def with_session(view):
    """
    Decorator checks whether a session is available either in
     - as a cookie
     - as a GET or POST parameter
    If it is, it sets the sessionID field on the request object
    which can be used within the decorated functions.

    In case of no session, user is redirected to login form.
    """

    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        request.sessionID = None

        if 'sessionID' in request.cookies:
            request.sessionID = request.cookies.get('sessionID')
        else:
            return flask.redirect(ZEEGUU_LOGIN + '?next=' + request.url)
        return view(*args, **kwargs)

    return wrapped_view
