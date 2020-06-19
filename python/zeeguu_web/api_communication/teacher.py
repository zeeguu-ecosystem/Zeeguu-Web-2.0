from zeeguu_web.api_communication.api_connection import get

IS_TEACHER = "is_teacher"


def is_teacher():
    resp = get(IS_TEACHER, session_needed=True)
    return resp.text == "True"
