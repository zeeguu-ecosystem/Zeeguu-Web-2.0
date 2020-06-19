import urllib


class URL():
    def __init__(self, url, title):
        self.url = url
        self.title = title

    def escaped(self):
        return urllib.parse.quote_plus(self.url)

    def __eq__(self, other):
        return self.url == other.url

    def __hash__(self):
        return hash(self.url)