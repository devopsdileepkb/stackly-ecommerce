import React, { useEffect, useMemo, useState } from "react";

import API from "./services/api";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [priceBounds, setPriceBounds] = useState([0, 50000]);

  useEffect(() => {
    API.get("/products").then((res) => {
      const data = res.data || [];
      setProducts(data);

      if (data.length) {
        const prices = data.map((product) => product.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceBounds([minPrice, maxPrice]);
        setPriceRange([minPrice, maxPrice]);
      }
    });
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((product) => product.category))];
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === "All" || product.category === selectedCategory;
      const priceMatch =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategory, priceRange]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handlePriceChange = (event) => {
    setPriceRange([priceBounds[0], Number(event.target.value)]);
  };

  return (
    <div className="app-shell">
      <Navbar cartCount={cartCount} />

      <div className="page-layout">
        <aside className="sidebar">
          <div className="sidebar-card">
            <h2>Categories</h2>
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    category === selectedCategory
                      ? "category-item active"
                      : "category-item"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <h2>Price Range</h2>
            <div className="price-range-values">
              <span>₹{priceBounds[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={priceBounds[0]}
              max={priceBounds[1]}
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="range-slider"
            />
          </div>

          <Cart cart={cart} />
        </aside>

        <main className="content-area">
          <div className="content-header">
            <div>
              <h1>All Products</h1>
              <p>{filteredProducts.length} items available</p>
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        </main>

        <aside className="checkout-panel">
          <Checkout cart={cart} />
        </aside>
      </div>
    </div>
  );
}

export default App;