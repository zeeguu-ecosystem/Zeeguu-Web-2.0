import flask
from flask import redirect
from . import account


@account.route("/install")
def install():
    return flask.render_template("static_pages/install.html")


@account.route("/chrome")
def chrome():
    return redirect("https://chrome.google.com/webstore/detail/zeeguu/ckncjmaednfephhbpeookmknhmjjodcd?hl=en", code=302)
