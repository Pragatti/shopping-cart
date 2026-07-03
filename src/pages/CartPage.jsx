import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CartLineItem from '../components/CartLineItem';
import './CartPage.css';

export default function CartPage() {
  const { items, totalItems, subtotal, changeQuantity, removeFromCart, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page__empty">
        <h1>Cart</h1>
        <p>Empty for now.</p>
        <Link to="/" className="cart-page__browse-link">
          Go shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Cart</h1>

      <ul className="cart-page__list">
        {items.map((item) => (
          <CartLineItem
            key={item.id}
            item={item}
            onQuantityChange={changeQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </ul>

      <div className="cart-page__footer">
        <button type="button" className="cart-page__clear" onClick={clearCart}>
          Empty cart
        </button>

        <div className="cart-page__summary">
          <p>{totalItems} item{totalItems === 1 ? '' : 's'}</p>
          <p className="cart-page__subtotal">${subtotal.toFixed(2)}</p>
          <Link to="/checkout" className="cart-page__checkout-btn">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
