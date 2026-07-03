import { useState, useEffect } from 'react';
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

const PER_PAGE = 8;

export default function ProductListPage() {
  const { products, status, error } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'default';
  const page = Number(searchParams.get('page') || 1);

  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearch = useDebounce(searchInput, 350);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  function updateUrl(changes) {
    setSearchParams((params) => {
      const next = new URLSearchParams(params);

      for (const [key, value] of Object.entries(changes)) {
        if (!value || value === 'all' || value === 'default' || value === 1) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }

      return next;
    });
  }

  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      updateUrl({ q: debouncedSearch, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  let filtered = products;

  if (category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  const q = searchQuery.trim().toLowerCase();
  if (q) {
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(q));
  }

  if (sort === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sort === 'rating-desc') {
    filtered = [...filtered].sort((a, b) => b.rating.rate - a.rating.rate);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const pageProducts = filtered.slice(start, start + PER_PAGE);

  const hasFilters = q || category !== 'all' || sort !== 'default';

  let countLine = null;
  if (filtered.length > 0) {
    if (totalPages > 1) {
      const end = Math.min(currentPage * PER_PAGE, filtered.length);
      countLine = `${start + 1}–${end} of ${filtered.length}`;
    } else {
      countLine = `${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
    }
  }

  function clearFilters() {
    setSearchInput('');
    setSearchParams({});
  }

  if (status === 'loading') {
    return (
      <div className="product-list">
        <h1>Shop</h1>
        <Loader label="Loading…" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="product-list">
        <h1>Shop</h1>
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-list__top">
        <h1>Shop</h1>
        {hasFilters && (
          <button type="button" className="product-list__clear" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <FilterBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        categories={categories}
        category={category}
        onCategoryChange={(value) => updateUrl({ category: value, page: 1 })}
        sort={sort}
        onSortChange={(value) => updateUrl({ sort: value, page: 1 })}
      />

      {countLine && <p className="product-list__count">{countLine}</p>}

      <ProductGrid
        products={pageProducts}
        searchQuery={q}
        onClearFilters={hasFilters ? clearFilters : undefined}
      />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => {
          updateUrl({ page: p });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
