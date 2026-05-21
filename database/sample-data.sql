-- Insert sample products
INSERT INTO products (name, description, price, stock) VALUES
('Wireless Headphones', 'High quality wireless headphones with noise cancellation', 79.99, 50),
('USB-C Cable', 'Durable USB-C charging and data cable', 12.99, 200),
('Portable Charger', '20000mAh portable battery charger', 39.99, 75),
('Phone Case', 'Protective silicone phone case', 19.99, 150),
('Screen Protector', 'Tempered glass screen protector', 9.99, 300),
('Bluetooth Speaker', 'Waterproof portable Bluetooth speaker', 49.99, 60),
('Webcam HD', '1080p HD webcam for streaming', 59.99, 40),
('Wireless Mouse', 'Silent wireless mouse with precision tracking', 29.99, 100);

-- Insert sample customers
INSERT INTO customers (name, email, phone, address, city, zip, country) VALUES
('John Doe', 'john.doe@example.com', '555-1234', '123 Main St', 'New York', '10001', 'USA'),
('Jane Smith', 'jane.smith@example.com', '555-5678', '456 Oak Ave', 'Los Angeles', '90001', 'USA'),
('Bob Johnson', 'bob.johnson@example.com', '555-9012', '789 Pine Rd', 'Chicago', '60601', 'USA'),
('Alice Williams', 'alice.williams@example.com', '555-3456', '321 Elm St', 'Houston', '77001', 'USA');

-- Insert sample orders
INSERT INTO orders (customer_id, total_amount, status) VALUES
(1, 99.98, 'completed'),
(2, 149.97, 'completed'),
(3, 59.99, 'pending'),
(4, 199.96, 'shipped');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 79.99),
(1, 3, 1, 39.99),
(2, 2, 3, 12.99),
(2, 4, 1, 19.99),
(3, 6, 1, 49.99),
(4, 1, 2, 79.99),
(4, 5, 1, 9.99);
