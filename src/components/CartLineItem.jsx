import { Link } from 'react-router-dom';
import './CartLineItem.css';

export default function CartLineItem({ item, onSetQuantity, onRemove }) {
  const lineTotal = item.price * item.quantity;

  return (
    <li className="cart-line">
      <Link to={`/products/${item.id}`} className="cart-line__image">
        <img src={item.image} alt={item.title} />
      </Link>

      <div className="cart-line__info">
        <Link to={`/products/${item.id}`} className="cart-line__title">
          {item.title}
        </Link>
        <p className="cart-line__unit-price">${item.price.toFixed(2)} each</p>
      </div>

      <div className="cart-line__quantity">
        <label htmlFor={`qty-${item.id}`} className="visually-hidden">
          Quantity for {item.title}
        </label>
        <div className="cart-line__quantity-control">
          <button
            type="button"
            onClick={() => onSetQuantity(item.id, item.quantity - 1)}
            aria-label={`Decrease quantity of ${item.title}`}
          >
            −
          </button>
          <input
            id={`qty-${item.id}`}
            type="number"
            min="1"
            value={item.quantity}
            onChange={(event) => {
              const value = Math.max(1, Number(event.target.value) || 1);
              onSetQuantity(item.id, value);
            }}
          />
          <button
            type="button"
            onClick={() => onSetQuantity(item.id, item.quantity + 1)}
            aria-label={`Increase quantity of ${item.title}`}
          >
            +
          </button>
        </div>
      </div>

      <p className="cart-line__total">${lineTotal.toFixed(2)}</p>

      <button
        type="button"
        className="cart-line__remove"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.title} from cart`}
      >
        Remove
      </button>
    </li>
  );
}
