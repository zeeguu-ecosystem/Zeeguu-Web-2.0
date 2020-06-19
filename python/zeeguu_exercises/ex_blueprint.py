from flask import Blueprint

ex_blueprint = Blueprint('ex_blueprint', __name__,
                         template_folder='templates',
                         static_folder='static')

print (" == created ex_blueprint...")

