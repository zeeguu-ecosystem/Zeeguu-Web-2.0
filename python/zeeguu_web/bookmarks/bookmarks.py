from flask import render_template

from zeeguu_web.api_communication.bookmarks import get_learned_bookmarks, get_bookmarks_by_date, get_top_bookmarks, \
    get_starred_bookmarks
from zeeguu_web.bookmarks import bookmarks_blueprint
from zeeguu_web.crosscutting_concerns import login_first


@bookmarks_blueprint.route("/bookmarks")
@login_first
def bookmarks():
    data = get_bookmarks_by_date()

    return render_template("bookmarks/bookmarks.html", **data
                           )


@bookmarks_blueprint.route("/top_bookmarks")
@login_first
def top_bookmarks():
    bookmarks = get_top_bookmarks(10)

    return render_template("bookmarks/bookmarks_top.html",
                           bookmarks=bookmarks)


@bookmarks_blueprint.route("/learned_bookmarks")
@login_first
def learned_bookmarks():
    bookmarks = get_learned_bookmarks()

    return render_template("bookmarks/bookmarks_learned.html",
                           bookmarks=bookmarks)


@bookmarks_blueprint.route("/starred_bookmarks")
@login_first
def starred_bookmarks():
    bookmarks = get_starred_bookmarks()

    return render_template("bookmarks/bookmarks_starred.html",
                           bookmarks=bookmarks)
