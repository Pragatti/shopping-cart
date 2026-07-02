import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="product-grid__empty">
        <p>No products match your filters.</p>
        <p className="product-grid__empty-hint">Try a different search term or clear a filter.</p>
      </div>
    );
  }

  return (
    <ul className="product-grid" aria-label="Products">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
