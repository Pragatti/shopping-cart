import { useEffect, useState } from 'react';
import { fetchProductById } from '../api/api';

export default function useProductDetail(id) {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    setStatus('loading');
    setError(null);
    setProduct(null);

    fetchProductById(id)
      .then((data) => {
        if (!isActive) return;

        if (!data) {
          setStatus('not-found');
          return;
        }

        setProduct(data);
        setStatus('success');
      })
      .catch((err) => {
        if (!isActive) return;

        setError(err.message);
        setStatus('error');
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  return { product, status, error };
}