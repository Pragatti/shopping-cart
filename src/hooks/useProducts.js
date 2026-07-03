import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/api';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    fetchProducts()
      .then((data) => {
        if (isActive) {
          setProducts(data);
          setStatus('success');
        }
      })
      .catch((err) => {
        if (isActive) {
          setError(err.message);
          setStatus('error');
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { products, status, error };
}