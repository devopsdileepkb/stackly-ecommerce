import React from "react";

const Cart = ({ cart }) => {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-card">
      <h2>Cart Summary</h2>
      {cart.length === 0 ? (
        <p className="empty-state">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <div className="cart-item-meta">
                  {item.quantity} x ₹{item.price.toLocaleString()}
                </div>
              </div>
              <div className="cart-item-total">
                ₹{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="cart-total">
        <span>Total</span>
        <strong>₹{total.toLocaleString()}</strong>
      </div>
    </div>
  );
};

export default Cart;