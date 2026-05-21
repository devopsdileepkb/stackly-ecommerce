from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

products = [
    {"id": 1, "name": "Laptop", "price": 50000},
    {"id": 2, "name": "Phone", "price": 20000},
    {"id": 3, "name": "Headphones", "price": 3000}
]

@app.route('/')
def root():
    return jsonify({"message": "backend running"})

@app.route('/products')
def get_products_alias():
    return jsonify(products)

@app.route('/api/products')
def get_products():
    return jsonify(products)

@app.route('/api/health')
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
