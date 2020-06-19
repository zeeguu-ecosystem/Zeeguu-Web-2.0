from flask import Flask
from zeeguu_exercises import ex_blueprint


app = Flask(__name__)
app.register_blueprint(ex_blueprint)

if __name__ == "__main__":
    app.run(debug=True)
