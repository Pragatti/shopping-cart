import { useEffect, useState } from 'react';
import { fetchCategories } from '../api/api';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchCategories();
        if (!cancelled) {
          setCategories(data);
          setStatus('success');
        }
      } catch {
        // Category filter is a non-critical enhancement — fail quietly
        // and simply show no category options rather than blocking the page.
        if (!cancelled) setStatus('error');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, status };
}
