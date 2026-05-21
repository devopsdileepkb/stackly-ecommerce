from flask import Flask
from flask_cors import CORS


from app.routes.products import products_bp
from app.routes.orders import orders_bp
from app.routes.health import health_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(products_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(health_bp)

app.run(host="0.0.0.0", port=5000)