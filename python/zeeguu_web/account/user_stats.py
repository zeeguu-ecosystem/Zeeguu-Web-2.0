from zeeguu_web.api_communication.user_stats import bookmark_counts_by_date
from . import account

from zeeguu_web.crosscutting_concerns import login_first

import flask


@account.route("/stats", methods=["GET"])
@login_first
def stats():
    return flask.render_template("account/user_stats.html",
                                 bookmark_counts_by_date=bookmark_counts_by_date())
