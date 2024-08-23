// app/page.jsx

/*import React from 'react';
import axios from 'axios';

const ProductsPage = async () => {
  try {
    // Fetch data from your backend API using Axios
    const response = await axios.get('http://localhost:4500/products'); // Adjust the URL to match your backend
    const products = response.data;

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={product.images[0]} // Assuming you have a main image in the images array
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">${product.price.toFixed(2)}</p>
                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching products:', error);

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>
        <p className="text-center text-red-600">Failed to load products. Please try again later.</p>
      </div>
    );
  }
};

export default ProductsPage;*/

/*"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';



const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend API
    axios.get('http://localhost:4500/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product._id} href={`/pages/${product._id}`}>
            <div className="cursor-pointer block bg-white shadow-lg rounded-lg overflow-hidden transform transition hover:scale-105">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;*/

// pages/index.jsx
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4500/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const addToCart = async (product, quantity = 1) => {
    try {
      const userId = 'yourUserId'; 
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      const response = await axios.post('http://localhost:4500/cart', {
        userId,
        productId: product._id,
        quantity
      });

      if (response.status === 200) {
        alert('Product added to cart!');
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error.message);
      alert('Failed to add product to cart');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="cursor-pointer block bg-white shadow-lg rounded-lg overflow-hidden transform transition hover:scale-105">
            <Link href={`/${product._id}`}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">${product.price.toFixed(2)}</p>
              </div>
            </Link>
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-blue-500 text-white py-2 rounded-b-lg hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/cart" className="text-blue-500 hover:underline">
          Go to Cart
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
