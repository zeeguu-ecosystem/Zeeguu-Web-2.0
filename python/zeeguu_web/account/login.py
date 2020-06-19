import flask
from flask import make_response, redirect

from zeeguu_web.api_communication import session_management
from zeeguu_web.api_communication.api_connection import APIException
from zeeguu_web.api_communication import user_details
from zeeguu_web.constants import *
from zeeguu_web.crosscutting_concerns.session_storage import set_session_data

from . import account

from zeeguu_web.crosscutting_concerns import login_first


@account.route("/login", methods=("GET", "POST"))
def login():
    """
    
        check user credentials
        if next=... parameter is present redirect on success
        
    """

    form = flask.request.form
    if flask.request.method == "POST" and form.get("login", False):
        password = form.get("password", None)
        email = form.get("email", None)

        if password is None or email is None:
            flask.flash("Please enter your email address and password")
        else:
            try:
                sessionID = session_management.login(email, password)
                details = user_details(sessionID)
            except APIException as e:
                flask.flash(e.message)

            else:
                response = make_response(redirect(flask.request.args.get("next") or flask.url_for('reader_blueprint.articles')))

                set_session_data(details, sessionID, response)

                return response

    return flask.render_template("account/login.html")


@account.route("/logout")
@login_first
def logout():
    try:
        session_management.logout()
    except APIException:
        print("Logout at server failed, still removing session key.")

    for key in SESSION_KEYS:
        flask.session.pop(key, None)

    response = make_response(redirect(flask.url_for("static_pages.index")))
    response.delete_cookie(KEY__STAND_ALONE_SESSION_ID)
    response.delete_cookie(KEY__FLASK_SESSION)
    response.delete_cookie(KEY__NATIVE_LANG)
    return response


@account.route("/logged_in")
@login_first
def logged_in():
    if flask.session.get(KEY__SESSION_ID, None):
        return "YES"
    return "NO"
