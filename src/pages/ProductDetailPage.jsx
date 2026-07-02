import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useProductDetail from '../hooks/useProductDetail';
import useCart from '../hooks/useCart';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, status, error } = useProductDetail(id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (status === 'loading') {
    return <Loader label="Loading product…" />;
  }

  if (status === 'not-found') {
    return (
      <div className="product-detail__missing">
        <h1>Product not found</h1>
        <p>We couldn't find a product with that ID.</p>
        <Link to="/">← Back to all products</Link>
      </div>
    );
  }

  if (status === 'error') {
    return <ErrorMessage message={error} onRetry={() => navigate(0)} />;
  }

  function handleAddToCart() {
    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <article className="product-detail">
      <Link to="/" className="product-detail__back">
        ← Back to all products
      </Link>

      <div className="product-detail__grid">
        <div className="product-detail__image-wrap">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-detail__info">
          <span className="product-detail__category">{product.category}</span>
          <h1>{product.title}</h1>
          <StarRating rating={product.rating} />
          <p className="product-detail__price">${product.price.toFixed(2)}</p>
          <p className="product-detail__description">{product.description}</p>

          <div className="product-detail__actions">
            <div className="product-detail__quantity">
              <label htmlFor="quantity">Quantity</label>
              <div className="product-detail__quantity-control">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) => {
                    const value = Math.max(1, Number(event.target.value) || 1);
                    setQuantity(value);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button type="button" className="product-detail__add-btn" onClick={handleAddToCart}>
              {justAdded ? 'Added ✓' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
