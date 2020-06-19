from . import static_pages

import flask

@static_pages.route("/about")
def about():
    return flask.render_template("static_pages/about.html")
