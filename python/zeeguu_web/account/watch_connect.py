from zeeguu_web.constants import KEY__SESSION_ID
from . import account

from zeeguu_web.crosscutting_concerns import login_first

import flask


@account.route("/watch_connect", methods=["GET"])
@login_first
def watch_connect():
    s = flask.session[KEY__SESSION_ID]

    session_id = s.zfill(8)
    watch_connect = session_id[:4] + "-" + session_id[4:]

    return flask.render_template("account/watch_connect.html",
                                 smartwatch_login_code=watch_connect)
