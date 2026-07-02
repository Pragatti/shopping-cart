import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useCategories from '../hooks/useCategories';
import useDebounce from '../hooks/useDebounce';
import FilterBar from '../components/FilterBar';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './ProductListPage.css';

const PAGE_SIZE = 8;

export default function ProductListPage() {
  const { products, status, error } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL is the source of truth for shareable/back-button-friendly state.
  const urlQuery = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'default';
  const page = Number(searchParams.get('page') || '1');

  // Local input state lets the text box feel instant while the actual
  // filtering (and URL update) is debounced.
  const [searchInput, setSearchInput] = useState(urlQuery);
  const debouncedSearch = useDebounce(searchInput, 350);

  // Keep the box in sync if the URL changes from elsewhere (e.g. header search).
  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);

  const updateParams = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '' || value === 'all' || value === 'default' || value === 1) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        });
        return next;
      });
    },
    [setSearchParams]
  );

  // Push the debounced search term into the URL, resetting to page 1.
  useEffect(() => {
    if (debouncedSearch !== urlQuery) {
      updateParams({ q: debouncedSearch, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const filtered = useMemo(() => {
    let result = products;

    if (category !== 'all') {
      result = result.filter((product) => product.category === category);
    }

    if (urlQuery.trim()) {
      const needle = urlQuery.trim().toLowerCase();
      result = result.filter((product) => product.title.toLowerCase().includes(needle));
    }

    if (sort === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === 'rating-desc') {
      result = [...result].sort((a, b) => b.rating.rate - a.rating.rate);
    }

    return result;
  }, [products, category, urlQuery, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  if (status === 'loading') {
    return (
      <div>
        <h1>All products</h1>
        <Loader label="Loading products…" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div>
        <h1>All products</h1>
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div>
      <h1>All products</h1>

      <FilterBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        categories={categories}
        category={category}
        onCategoryChange={(value) => updateParams({ category: value, page: 1 })}
        sort={sort}
        onSortChange={(value) => updateParams({ sort: value, page: 1 })}
      />

      <p className="product-list__count">
        {filtered.length} product{filtered.length === 1 ? '' : 's'} found
      </p>

      <ProductGrid products={pageItems} />

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={(nextPage) => {
          updateParams({ page: nextPage });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
