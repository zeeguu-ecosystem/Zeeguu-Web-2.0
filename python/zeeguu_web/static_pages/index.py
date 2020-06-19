from flask import url_for

from zeeguu_web.constants import KEY__SESSION_ID

from . import static_pages

import flask


@static_pages.route("/favicon.ico")
def get_favicon():
    return flask.redirect(url_for('static', filename='img/favicon.ico'))


@static_pages.route("/")
def index():
    if KEY__SESSION_ID in flask.session:
        return flask.redirect(flask.url_for('reader_blueprint.articles'))
    return flask.render_template("static_pages/index.html")
