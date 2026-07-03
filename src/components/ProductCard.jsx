import { Link } from 'react-router-dom';
import { formatCategory } from '../utils/formatCategory';
import StarRating from './StarRating';
import './ProductCard.css';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{formatCategory(product.category)}</span>
        <h3 className="product-card__title">{product.title}</h3>
        <StarRating rating={product.rating} />
        <div className="product-card__price-row">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
