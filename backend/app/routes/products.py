from flask import Blueprint, jsonify

products_bp = Blueprint("products", __name__)

@products_bp.route("/products")

def products():

    return jsonify([
        {
            "id": 1,
            "name": "iPhone 15",
            "price": 79999,
            "category": "Smartphones",
            "description": "High-performance smartphone with pro-level camera features.",
            "image": "https://via.placeholder.com/300x200?text=iPhone+15"
        },
        {
            "id": 2,
            "name": "MacBook Pro",
            "price": 139999,
            "category": "Laptops",
            "description": "Powerful productivity laptop for creators and development.",
            "image": "https://via.placeholder.com/300x200?text=MacBook+Pro"
        },
        {
            "id": 3,
            "name": "AirPods Pro",
            "price": 25999,
            "category": "Accessories",
            "description": "Noise-cancelling earbuds with spatial audio.",
            "image": "https://via.placeholder.com/300x200?text=AirPods+Pro"
        },
        {
            "id": 4,
            "name": "Apple Watch",
            "price": 45999,
            "category": "Wearables",
            "description": "Smart fitness watch with heart rate and activity tracking.",
            "image": "https://via.placeholder.com/300x200?text=Apple+Watch"
        }
    ])