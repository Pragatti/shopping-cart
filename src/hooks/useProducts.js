import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/api';

/**
 * Fetches the full product list once. Filtering/sorting/pagination are
 * done client-side in the page component with useMemo, since the Fake
 * Store API has no server-side query params for those and the dataset
 * is small (~20 items).
 */
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus('loading');
      setError(null);
      try {
        const data = await fetchProducts();
        if (!cancelled) {
          setProducts(data);
          setStatus('success');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load products.');
          setStatus('error');
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, status, error };
}
