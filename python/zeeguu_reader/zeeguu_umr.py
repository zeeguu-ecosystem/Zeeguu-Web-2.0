from flask import Flask
from zeeguu_reader.login import endpoints_login
from zeeguu_reader import reader_blueprint

app = Flask(__name__)
app.register_blueprint(endpoints_login)
app.register_blueprint(reader_blueprint)
