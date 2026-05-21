import React, { useState } from "react";

const ProductCard = ({ product, addToCart }) => {
  const makeFallback = (name) => {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
        <rect width='100%' height='100%' fill='%23f8fafc' />
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='%234b5563' font-family='Arial, Helvetica, sans-serif'>${name}</text>
      </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  };

  const [imgSrc, setImgSrc] = useState(product.image || makeFallback(product.name));

  const handleError = () => setImgSrc(makeFallback(product.name));

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imgSrc} alt={product.name} onError={handleError} />
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>
        {product.category && <p className="product-category">{product.category}</p>}
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        <div className="product-meta">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          <button
            className="primary-button"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;