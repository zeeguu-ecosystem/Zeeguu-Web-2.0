import datetime

from zeeguu_web.api_communication.models.URL import URL

CONTEXT_LENGTH = 42

JSON_TIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"


class Bookmark:

    def __init__(self, id, to, from_lang, to_lang, url, origin_importance, origin_rank, from_, starred, context,
                 learned_datetime, created_day, article_id, time, date):
        self.id = id
        self.to = to
        self.from_lang = from_lang
        self.to_lang = to_lang
        self.url = url
        self.origin_importance = origin_importance
        self.origin_rank = origin_rank
        self.from_ = from_
        self.starred = starred
        self.context = context
        self.learned_datetime = learned_datetime
        self.created_day = created_day
        self.article_id = article_id
        self.time = time
        self.date = date

    def set_date(self, date):
        self.date = date

    @classmethod
    def get_first_N_words_of_context(cls, context):
        split = context.split()[:CONTEXT_LENGTH]
        return ' '.join(split)

    @classmethod
    def string_representation_of_importance(cls, importance):
        if importance < 1:
            importance = 0

        rep = ""
        for imp in range(0, int(importance)):
            rep = f"<span style='font-size:{imp+7}pt'>|</span>" + rep
        return rep

    @classmethod
    def from_json(cls, _json):
        id = _json["id"]
        to = _json["to"]
        from_lang = _json["from_lang"]
        to_lang = _json["to_lang"]
        from_ = _json["from"]
        starred = _json["starred"]
        origin_rank = _json["origin_rank"]
        learned_datetime = _json["learned_datetime"]
        created_day = _json["created_day"]
        article_id = _json['article_id']
        time = datetime.datetime.strptime(_json["time"], JSON_TIME_FORMAT)
        date = time.date()

        url = URL(_json["url"], _json["title"])
        context = cls.get_first_N_words_of_context(_json["context"])
        origin_importance = cls.string_representation_of_importance(_json["origin_importance"])
        if origin_rank:
            origin_rank = origin_rank // 1000 + 1

        return Bookmark(id, to, from_lang, to_lang, url, origin_importance, origin_rank, from_, starred, context,
                        learned_datetime, created_day, article_id, time, date)
