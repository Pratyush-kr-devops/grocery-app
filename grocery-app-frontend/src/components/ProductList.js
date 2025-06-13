import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  useEffect(() => {
    axios.get(`${API_URL}/api/products`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, [API_URL]);

  return (
    <div>
      <h2>Our Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
