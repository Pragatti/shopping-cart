import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ products, searchQuery, onClearFilters }) {
  if (products.length === 0) {
    return (
      <div className="product-grid__empty">
        <p>{searchQuery ? `No results for "${searchQuery}"` : 'No products here'}</p>
        {onClearFilters && (
          <button type="button" className="product-grid__clear" onClick={onClearFilters}>
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <ul className="product-grid">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
