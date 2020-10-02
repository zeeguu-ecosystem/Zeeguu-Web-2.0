import flask

from zeeguu_web.constants import KEY__SESSION_ID, KEY__USER_NAME, KEY__STAND_ALONE_SESSION_ID, KEY__NATIVE_LANG


def set_session_data(details, sessionID, response):
    """
    Set session information for later usage
    """

    flask.session[KEY__SESSION_ID] = sessionID
    flask.session[KEY__USER_NAME] = details["name"]

    flask.session.permanent = True

    from zeeguu_web.app import app
    SECURE = not app.config.get('SSL_NOT_AVAILABLE')

    response.set_cookie(KEY__STAND_ALONE_SESSION_ID, str(sessionID), max_age=31536000, samesite='None', secure=SECURE)
    response.set_cookie(KEY__NATIVE_LANG, details["native_language"], max_age=31536000, samesite='None', secure=SECURE)
