from zeeguu_web.api_communication.api_connection import post, get

CREATE_USER = "add_user/"
USER_SETTINGS = "user_settings"
LEARNED_LANGUAGE = "learned_language/"
NATIVE_LANGUAGE = "native_language/"

REQUEST_CODE = "send_code/"
RESET_PASSWORD = "reset_password/"

USER_DETAILS = "get_user_details"


def create_account(email, username, password, learning_language, native_language, invite_code):
    api_address = CREATE_USER + email
    resp = post(api_address, payload={"password": password, "username": username, "invite_code": invite_code})
    session = int(resp.text)

    # What to do when the server crashes here?
    native = NATIVE_LANGUAGE + native_language
    learned = LEARNED_LANGUAGE + learning_language
    resp = post(native, session_needed=True, session=session)
    resp = post(learned, session_needed=True, session=session)
    return session


def request_code(email):
    api_addres = REQUEST_CODE + email
    resp = post(api_addres)


def reset_password(code, email, password):
    api_address = RESET_PASSWORD + email
    resp = post(api_address, payload={"code": code, "password": password})


def get_current_user_settings():
    return get(USER_DETAILS, session_needed=True)


def set_user_settings(name: str,
                      email: str,
                      native_language_code: str,
                      learned_language_code: str,
                      language_level_data: 'Array'):
    return post(USER_SETTINGS,
                payload={
                    'name': name,
                    'native_language_code': native_language_code,
                    'learned_language_code': learned_language_code,
                    'language_level_data': language_level_data,
                    'email': email},
                session_needed=True)
