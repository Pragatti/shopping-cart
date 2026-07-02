import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CartLineItem from '../components/CartLineItem';
import './CartPage.css';

export default function CartPage() {
  const { items, itemCount, subtotal, setQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page__empty">
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/" className="cart-page__browse-link">
          Browse products →
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your cart</h1>

      <ul className="cart-page__list">
        {items.map((item) => (
          <CartLineItem key={item.id} item={item} onSetQuantity={setQuantity} onRemove={removeItem} />
        ))}
      </ul>

      <div className="cart-page__footer">
        <button type="button" className="cart-page__clear" onClick={clearCart}>
          Clear cart
        </button>

        <div className="cart-page__summary">
          <p>
            {itemCount} item{itemCount === 1 ? '' : 's'}
          </p>
          <p className="cart-page__subtotal">Subtotal: ${subtotal.toFixed(2)}</p>
          <Link to="/checkout" className="cart-page__checkout-btn">
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
