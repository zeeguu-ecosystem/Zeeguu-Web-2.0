from flask import request, render_template
from .session import with_session
from .umr_blueprint import reader_blueprint
import urllib
from .zeeguu_server import ZEEGUU_API
import requests
import json


@reader_blueprint.route('/bookmarks', methods=['GET'])
@with_session
def bookmarksreader():
    """Return the main page where the articles and feeds are listed."""
    return get_bookmarks_page()


def get_bookmarks_page():
    """Return the template that shows all available articles and feeds."""
    return render_template('bookmarks.html')
