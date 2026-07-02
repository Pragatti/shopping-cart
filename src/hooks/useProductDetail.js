import { useEffect, useState } from 'react';
import { fetchProductById } from '../api/api';

export default function useProductDetail(id) {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error' | 'not-found'
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus('loading');
      setError(null);
      setProduct(null);
      try {
        const data = await fetchProductById(id);
        if (cancelled) return;
        // fakestoreapi returns `null` (200 OK) for ids that don't exist.
        if (!data) {
          setStatus('not-found');
          return;
        }
        setProduct(data);
        setStatus('success');
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load this product.');
          setStatus('error');
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, status, error };
}
