import flask
from flask import make_response
from flask import flash

from zeeguu_web.api_communication import account_management
from zeeguu_web.api_communication.api_connection import APIException
from zeeguu_web.api_communication import get_available_languages, get_available_native_languages
from zeeguu_web.api_communication import user_details
from zeeguu_web.constants import *
from zeeguu_web.crosscutting_concerns.session_storage import set_session_data

from . import account

LANGUAGE_NAMES_MAP = {

    'da': 'Danish',
    'de': 'German',
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'it': 'Italian',
    'nl': 'Dutch',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ro': 'Romanian',
    'zh-CN': 'Chinese'

}


def code_language_pairs(code_list):
    return [(code, LANGUAGE_NAMES_MAP[code]) for code in code_list]


@account.route("/create_account", methods=("GET", "POST"))
def create_account():
    # A cool way of passing the arguments to the flask template
    template_arguments = dict(
        languages=code_language_pairs(get_available_languages()),
        native_languages=code_language_pairs(get_available_native_languages()),
        default_learned=DEFAULT_LANGUAGE
    )

    # GET
    if flask.request.method == "GET":
        return flask.render_template("account/create_account.html", **template_arguments)

    # POST
    form = flask.request.form
    password = form.get("password", None)
    email = form.get("email", None)
    name = form.get("name", None)
    code = form.get("code", None)
    language = form.get("language", None)
    native_language = form.get("native_language", None)

    if password is None or email is None or name is None:
        flash("Please enter your name, email address, and password")

    else:
        try:

            sessionID = account_management.create_account(email, name, password, language,
                                                          native_language,
                                                          invite_code=code)  # setting registration code is not possible

            response = make_response(flask.redirect(flask.url_for("account.my_settings")))

            details = user_details(sessionID)

            set_session_data(details, sessionID, response)

            return response

        except ValueError:
            flash("Username could not be created. Please contact us.")
        except APIException as e:
            flask.flash(e.message)
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            flash("Something went wrong. Please contact us.")

    return flask.render_template("account/create_account.html", **template_arguments)
