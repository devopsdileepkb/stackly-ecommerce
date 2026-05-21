import React from "react";

const Navbar = ({ cartCount }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Stackly E-Commerce</div>
      <div className="navbar-actions">
        <button className="cart-pill">Cart {cartCount}</button>
      </div>
    </nav>
  );
};

export default Navbar;
