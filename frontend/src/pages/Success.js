import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = ({ orderId }) => {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-message">
        <h1>Order Successful!</h1>
        <p>Your order has been placed successfully.</p>
        <p>Order ID: {orderId}</p>
        <p>You will receive a confirmation email shortly.</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    </div>
  );
};

export default Success;
