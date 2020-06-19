from flask import render_template

from zeeguu_web.api_communication.bookmarks import get_bookmarks_for_article
from zeeguu_web.bookmarks import bookmarks_blueprint
from zeeguu_web.crosscutting_concerns import login_first


@bookmarks_blueprint.route("/bookmarks_for_article/<int:article_id>")
@login_first
def bookmarks_for_article1(article_id: int):
    data = get_bookmarks_for_article(article_id)

    return render_template("bookmarks/bookmarks_for_article.html", **data)


@bookmarks_blueprint.route("/bookmarks_for_article/<int:article_id>/<int:user_id>")
@login_first
def bookmarks_for_article2(article_id: int, user_id):
    data = get_bookmarks_for_article(article_id, user_id)

    return render_template("bookmarks/bookmarks_for_article.html", **data)
