import { Link } from 'react-router-dom';
import { memo } from 'react';
import StarRating from './StarRating';
import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__title">{product.title}</h3>
        <StarRating rating={product.rating} />
      </div>
      <div className="product-card__tag" aria-hidden="true">
        <span className="product-card__tag-hole" />
        <span className="product-card__tag-price">${product.price.toFixed(2)}</span>
      </div>
    </Link>
  );
}

// Products render in a grid that can be dozens of items; memoize so that
// unrelated state changes on the listing page (e.g. sort dropdown open
// state) don't re-render every card.
export default memo(ProductCard);
