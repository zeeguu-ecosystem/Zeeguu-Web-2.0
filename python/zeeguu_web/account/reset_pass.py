# -*- coding: utf8 -*-

"""
    reset_pass.py: Helping the forgetful reset their password
"""

import flask
from flask import flash

# the account blueprint is defined in the __init__ of the module
from zeeguu_web.api_communication import account_management
from zeeguu_web.api_communication.api_connection import APIException
from . import account

import traceback
import sys


@account.route("/reset_pass", methods=("POST", "GET",))
def reset_password():

    """
    Three main states of this controller
          1. by default just show the email field
          2. in a second step, also show the field for the code and new password
          3. in a third step, if code is correct, redirect to login
    :return: template to be rendered
    """

    form = flask.request.form
    email = form.get("email", "")
    code = form.get("code", "")
    password = form.get("password", "")

    if email and not code:
        #generate_code_and_send_email(email)
        account_management.request_code(email)
        flash("Now check your inbox for a one-time code")
        return flask.render_template("account/reset_pass.html", code_active=True, email=email)

    if email and code and password:
        try:
            account_management.reset_password(code, email, password)
            flash("Password was reset successfully!")
            return flask.redirect('login')
        except APIException as e:
            flash(e.message)
            traceback.print_exc(file=sys.stdout)
            return flask.render_template("account/reset_pass.html", message=True)

    flash("This will be fast. We promise.")
    return flask.render_template("account/reset_pass.html")
