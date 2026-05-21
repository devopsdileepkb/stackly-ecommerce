import React, { useState } from 'react';

const AddressForm = ({ onSubmit }) => {
  const [address, setAddress] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    zip: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(address);
  };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <input type="text" name="name" placeholder="Full Name" value={address.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={address.email} onChange={handleChange} required />
      <input type="text" name="street" placeholder="Street Address" value={address.street} onChange={handleChange} required />
      <input type="text" name="city" placeholder="City" value={address.city} onChange={handleChange} required />
      <input type="text" name="zip" placeholder="ZIP Code" value={address.zip} onChange={handleChange} required />
      <button type="submit">Continue</button>
    </form>
  );
};

export default AddressForm;
