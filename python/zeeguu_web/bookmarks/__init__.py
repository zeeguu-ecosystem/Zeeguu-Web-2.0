import flask

# we define the blueprint here, and extended it in several files
bookmarks_blueprint = flask.Blueprint("bookmarks_blueprint", __name__)

from .bookmarks import *
from .api_4_bookmark_management import *
from .bookmarks_for_article import *