import React, { useState } from "react";
import API from "../services/api";

const Checkout = ({ cart }) => {
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!cart.length) {
      alert("Add items to your cart before placing an order.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your shipping address.");
      return;
    }

    setIsSubmitting(true);

    try {
      await API.post("/orders", {
        address,
        items: cart,
        total,
      });
      setAddress("");
      alert("Order placed successfully!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-card">
      <h2>Checkout</h2>
      <p className="checkout-summary">
        {cart.length} items • ₹{total.toLocaleString()}
      </p>
      <textarea
        value={address}
        placeholder="Enter delivery address"
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        className="primary-button checkout-button"
        onClick={placeOrder}
        disabled={!cart.length || isSubmitting}
      >
        {isSubmitting ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;