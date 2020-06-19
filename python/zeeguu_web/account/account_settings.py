import json

from flask import flash, make_response

from zeeguu_web.account.account_settings_form import AccountSettingsForm
from zeeguu_web.api_communication.account_management import get_current_user_settings, set_user_settings
from zeeguu_web.constants import KEY__USER_NAME, KEY__NATIVE_LANG

from . import account

from zeeguu_web.crosscutting_concerns import login_first

import flask


@account.route("/my_settings", methods=["GET", "POSt"])
@login_first
def my_settings():
    user_info = get_current_user_settings()
    user_info_dict = user_info.json()

    cefr_levels = [key for key in user_info_dict if 'cefr' in key]
    cefr_values = [user_info_dict[key] for key in cefr_levels]

    at_least_one_cefr_level = False
    if any((each != '0' and each!= 0) for each in cefr_values):
        at_least_one_cefr_level = True

    form = AccountSettingsForm(flask.request.form, **user_info.json())

    if flask.request.method == 'POST':
        language_level_data = [
            ('da', form.da_cefr_level.data),
            ('de', form.de_cefr_level.data),
            ('en', form.en_cefr_level.data),
            ('es', form.es_cefr_level.data),
            ('fr', form.fr_cefr_level.data),
            ('it', form.it_cefr_level.data),
            ('nl', form.nl_cefr_level.data),
            ('pl', form.pl_cefr_level.data),
            ('pt', form.pt_cefr_level.data),
            ('ro', form.ro_cefr_level.data),
            ('cn', form.cn_cefr_level.data)
        ]

        # if this is left uncommented, one can't swich to None for a given language...
        # language_level_data = [each for each in language_level_data if int(each[1]) > 0]

        set_user_settings(form.name.data,
                          form.email.data,
                          form.native_language.data,
                          form.learned_language.data,
                          json.dumps(language_level_data))

        flask.session[KEY__USER_NAME] = form.name.data

        # flash("Successfully changed settings")
        response = make_response(flask.redirect(flask.url_for('reader_blueprint.articles')))
        response.set_cookie(KEY__NATIVE_LANG, form.native_language.data, max_age=31536000)

        return response

    return flask.render_template("account/account_settings.html", form=form,
                                 at_least_one_cefr_level=at_least_one_cefr_level)
