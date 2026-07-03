import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useProductDetail from '../hooks/useProductDetail';
import useCart from '../hooks/useCart';
import { formatCategory } from '../utils/formatCategory';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, status, error } = useProductDetail(id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (status === 'loading') {
    return <Loader label="Loading…" />;
  }

  if (status === 'not-found') {
    return (
      <div className="product-detail__missing">
        <h1>Not found</h1>
        <p>That product does not exist.</p>
        <Link to="/">Back to shop</Link>
      </div>
    );
  }

  if (status === 'error') {
    return <ErrorMessage message={error} onRetry={() => navigate(0)} />;
  }

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="product-detail">
      <Link to="/" className="product-detail__back">
        Back to shop
      </Link>

      <div className="product-detail__grid">
        <div className="product-detail__image-wrap">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-detail__info">
          <span className="product-detail__category">{formatCategory(product.category)}</span>
          <h1>{product.title}</h1>
          <StarRating rating={product.rating} />
          <p className="product-detail__price">${product.price.toFixed(2)}</p>
          <p className="product-detail__description">{product.description}</p>

          <div className="product-detail__actions">
            <div className="product-detail__quantity">
              <label htmlFor="quantity">Qty</label>
              <div className="product-detail__quantity-control">
                <button
                  type="button"
                  onClick={() => setQty((n) => Math.max(1, n - 1))}
                  aria-label="Less"
                >
                  −
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                />
                <button
                  type="button"
                  onClick={() => setQty((n) => n + 1)}
                  aria-label="More"
                >
                  +
                </button>
              </div>
            </div>

            <button type="button" className="product-detail__add-btn" onClick={handleAdd}>
              {added ? 'In cart' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
