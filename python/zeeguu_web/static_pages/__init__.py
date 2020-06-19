# -*- coding: utf8 -*-


import flask

# we define the blueprint here, and extended it in several files
static_pages = flask.Blueprint("static_pages", __name__)

from .index import *
from .about import *
from .conferences import *
