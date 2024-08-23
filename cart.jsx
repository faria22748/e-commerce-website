"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = '60f8f4dcd1bd4e1c4c95b3a9'; // Replace with actual user ID
        const response = await axios.get(`http://localhost:4500/cart/${userId}`);
        setCart(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to fetch cart');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>
      <div className="space-y-4">
        {cart.products.map((item) => (
          <div key={item._id} className="flex items-center justify-between bg-white shadow-md rounded-lg p-4">
            {item.product && item.product.images && (
              <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 object-cover" />
            )}
            <div className="flex-1 ml-4">
              <h2 className="text-xl font-semibold text-gray-800">{item.product?.name || 'Product Name'}</h2>
              <p className="text-gray-600 mt-2">{item.product?.description || 'No Description'}</p>
              <p className="text-lg font-bold text-gray-900 mt-2">${item.product?.price?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="text-lg font-bold text-gray-900">
              Quantity: {item.quantity}
            </div>
          </div>
        ))}
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-gray-900">Total: ${cart.products.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0).toFixed(2)}</h2>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
