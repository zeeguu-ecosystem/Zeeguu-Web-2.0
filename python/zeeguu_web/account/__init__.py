# -*- coding: utf8 -*-


import flask

# we define the blueprint here, and extended it in several files
account = flask.Blueprint("account", __name__)

from . import login
from . import reset_pass
from . import static_pages
from . import user_stats
from . import watch_connect
from . import account_settings
from . import create_account
