from flask import Blueprint, request, jsonify

from app.database.db import db

orders_bp = Blueprint("orders", __name__)

@orders_bp.route("/orders", methods=["POST"])

def orders():

    data = request.json

    cursor = db.cursor()

    query = """
    INSERT INTO orders(address,total)
    VALUES(%s,%s)
    """

    cursor.execute(
        query,
        (data["address"], data["total"])
    )

    db.commit()

    return jsonify({
        "message": "Order placed"
    })