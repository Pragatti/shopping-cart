import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCart from '../hooks/useCart';
import './Header.css';

export default function Header() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Keep the header search box in sync if the user navigates back to the
  // listing page with a different ?q= value (e.g. via browser back button).
  useEffect(() => {
    if (location.pathname === '/') {
      setQuery(searchParams.get('q') || '');
    }
  }, [location.pathname, searchParams]);

  function handleSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams(location.pathname === '/' ? searchParams : undefined);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    navigate(`/?${params.toString()}`);
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <span className="header__logo-mark" aria-hidden="true">⌂</span>
          Marketstand
        </Link>

        <form className="header__search" role="search" onSubmit={handleSubmit}>
          <label htmlFor="header-search" className="visually-hidden">
            Search products
          </label>
          <input
            id="header-search"
            type="search"
            placeholder="Search products…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <Link to="/cart" className="header__cart" aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}>
          <span aria-hidden="true">🛒</span>
          <span className="header__cart-badge">{itemCount}</span>
        </Link>
      </div>
    </header>
  );
}
