import datetime
from flask import json
from collections import OrderedDict

from zeeguu_web.api_communication.api_connection import post, get
from zeeguu_web.api_communication.models.Bookmark import Bookmark

BOOKMARKS_BY_DATE = "bookmarks_by_day"
BOOKMARKS_FOR_ARTICLE = "bookmarks_for_article/"
DELETE_BOOKMARK = "delete_bookmark/"
REPORT_LEARNED_BOOKMARK = "report_correct_mini_exercise/"
STAR_BOOKMARK = "star_bookmark/"
UNSTAR_BOOKMARK = "unstar_bookmark/"
TOP_BOOKMARKS = "top_bookmarks"
LEARNED_BOOKMARKS = "learned_bookmarks"
STARRED_BOOKMARKS = "starred_bookmarks"


def get_starred_bookmarks():
    resp = get(STARRED_BOOKMARKS + "/50", session_needed=True)
    _json = json.loads(resp.content)

    bookmarks = []
    for data in _json:
        bm = Bookmark.from_json(data)
        bookmarks.append(bm)

    return bookmarks


def get_top_bookmarks(count):
    resp = get(f"{TOP_BOOKMARKS}/{count}", session_needed=True)
    _json = json.loads(resp.content)

    bookmarks = []
    for data in _json:
        bm = Bookmark.from_json(data)
        bookmarks.append(bm)

    return bookmarks


def get_learned_bookmarks(count=100):
    resp = get(f"{LEARNED_BOOKMARKS}/{count}", session_needed=True)
    _json = json.loads(resp.content)

    bookmarks = []
    for data in _json:
        bm = Bookmark.from_json(data)
        bookmarks.append(bm)

    return bookmarks


def get_bookmarks_by_date(date=None):
    _payload = {
        "with_context": True,
        "with_title": True
    }
    if date:
        _date_string = date.strftime('%Y-%m-%dT%H:%M:%S')
        _payload["after_date"] = _date_string

    resp = post(BOOKMARKS_BY_DATE, payload=_payload, session_needed=True)
    _json = json.loads(resp.content)

    sorted_dates = []
    urls_for_date = {}
    contexts_for_url = {}
    bookmarks_for_context = {}
    bookmark_counts_by_date = {}
    article_ids_for_urls = {}

    for data in _json:
        each_date = datetime.datetime.strptime(data["date"], "%A, %d %B %Y")
        sorted_dates.append(each_date)

        urls_for_date.setdefault(each_date, [])

        for bookmark_json in data["bookmarks"]:
            # try:

                each_bookmark = Bookmark.from_json(bookmark_json)
                each_bookmark.set_date(each_date)
                each_context = each_bookmark.context

                if each_bookmark.url not in urls_for_date[each_date]:
                    urls_for_date[each_date].append(each_bookmark.url)

                contexts_for_url.setdefault(each_bookmark.url, [])
                if not each_context in contexts_for_url.get(each_bookmark.url):
                    contexts_for_url[each_bookmark.url].append(each_context)

                bookmarks_for_context.setdefault(each_context, [])
                bookmarks_for_context[each_context].append(each_bookmark)

                article_ids_for_urls[each_bookmark.url] = each_bookmark.article_id

            # except Exception:
            #     print("Parsing bookmark failed")


        bookmark_counts_by_date.setdefault(each_date, set()).add(len(data["bookmarks"]))

    return {
        "sorted_dates": sorted_dates,
        "urls_for_date": urls_for_date,
        "contexts_for_url": contexts_for_url,
        "bookmarks_for_context": bookmarks_for_context,
        "bookmark_counts_by_date": bookmark_counts_by_date,
        "article_ids_for_urls":article_ids_for_urls
    }


def get_bookmarks_for_article(article_id:int, user_id:int = None):
    _payload = {
        "with_context": True,
        "with_title": True
    }

    if user_id:
        resp = post(BOOKMARKS_FOR_ARTICLE + f'{article_id}/{user_id}', payload=_payload, session_needed=True)
    else:
        resp = post(BOOKMARKS_FOR_ARTICLE + f'{article_id}', payload=_payload, session_needed=True)

    _json = json.loads(resp.content)
    print(_json)

    bookmarks = [Bookmark.from_json(each) for each in _json['bookmarks']]

    dates = []

    contexts_for_date = OrderedDict()
    bookmarks_for_context = {}

    for each in bookmarks:

        if each.date not in dates:
            dates.append(each.date)

        if each.date not in contexts_for_date:
            contexts_for_date[each.date] = []

        if each.context not in contexts_for_date[each.date]:
            contexts_for_date[each.date].append(each.context)

        if each.context not in bookmarks_for_context:
            bookmarks_for_context[each.context] = []

        bookmarks_for_context[each.context].append(each)


    return {
        "sorted_dates": dates[::-1],
        "contexts_for_date": contexts_for_date,
        "bookmarks_for_context": bookmarks_for_context,
        "article_title":_json['article_title'],
        "article_id":article_id
    }


def delete_bookmark(bookmark_id):
    path = DELETE_BOOKMARK + str(bookmark_id)
    resp = post(path, session_needed=True)
    return resp.text


def report_correct_mini_exercise(bookmark_id):
    path = REPORT_LEARNED_BOOKMARK + str(bookmark_id)
    resp = post(path, session_needed=True)
    return resp.text


def star_bookmark(bookmark_id):
    path = STAR_BOOKMARK + str(bookmark_id)
    resp = post(path, session_needed=True)
    return resp.text


def unstar_bookmark(bookmark_id):
    path = UNSTAR_BOOKMARK + str(bookmark_id)
    resp = post(path, session_needed=True)
    return resp.text
