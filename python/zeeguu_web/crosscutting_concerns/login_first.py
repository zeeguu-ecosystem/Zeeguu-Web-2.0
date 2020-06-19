from functools import wraps

import flask

from zeeguu_web.constants import KEY__SESSION_ID, KEY__USER_NAME


def login_first(fun):
    """

    Function Wrapper

    Makes sure that the user is logged_in.

    If not, appends the intended url to the login url and redirects to login.

    """

    @wraps(fun)
    def decorated_function(*args, **kwargs):

        if KEY__SESSION_ID in flask.session:
            try:
                from zeeguu_web.api_communication import validate
                result = validate()
                if result:
                    flask.g.username = flask.session[KEY__USER_NAME]
                    return fun(*args, **kwargs)
            except Exception as e:
                print(e)

        next_url = flask.request.url
        login_url = '%s?next=%s' % (flask.url_for('account.login'), next_url)
        return flask.redirect(login_url)

    return decorated_function
