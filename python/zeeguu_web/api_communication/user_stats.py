from zeeguu_web.api_communication.api_connection import get

BOOKMARK_COUNTS_BY_DATE = "bookmark_counts_by_date"


def bookmark_counts_by_date():
    resp = get(BOOKMARK_COUNTS_BY_DATE, session_needed=True)
    return resp.text
