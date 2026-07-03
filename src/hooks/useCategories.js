import { useEffect, useState } from 'react';
import { fetchCategories } from '../api/api';

export default function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isActive = true;

    fetchCategories()
      .then((data) => {
        if (isActive) {
          setCategories(data);
        }
      })
      .catch(() => {});

    return () => {
      isActive = false;
    };
  }, []);

  return { categories };
}