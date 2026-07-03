import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useCart from '../hooks/useCart';
import './Header.css';

export default function Header() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    if (location.pathname === '/') {
      setQuery(searchParams.get('q') ?? '');
    }
  }, [location.pathname, searchParams]);

  function onSearch(e) {
    e.preventDefault();

    const params = new URLSearchParams(
      location.pathname === '/' ? searchParams : undefined,
    );
    const trimmed = query.trim();

    if (trimmed) params.set('q', trimmed);
    else params.delete('q');

    navigate(`/?${params.toString()}`);
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          Quick<span>Cart</span>
        </Link>

        <form className="header__search" onSubmit={onSearch}>
          <label htmlFor="header-search" className="visually-hidden">
            Search
          </label>
          <input
            id="header-search"
            type="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Go</button>
        </form>

        <Link to="/cart" className="header__cart">
          Cart
          {totalItems > 0 && <span className="header__cart-badge">{totalItems}</span>}
        </Link>
      </div>
    </header>
  );
}
