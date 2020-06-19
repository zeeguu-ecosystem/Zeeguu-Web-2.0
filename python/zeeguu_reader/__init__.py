from .umr_blueprint import reader_blueprint

# make sure that we load the .article and .articles endpoints.
# otherwise our blueprint won't be complete!

from .articles import get_articles_page
from .article import get_article
from .bookmarksreader import get_bookmarks_page
from .classroomreader import get_classroom_page