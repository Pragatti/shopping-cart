import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { validateCheckout } from '../utils/validateCheckout';
import './CheckoutPage.css';

const INITIAL_VALUES = { name: '', email: '', address: '', cardNumber: '' };

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateCheckout({ ...values }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateCheckout(values);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, address: true, cardNumber: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsProcessing(true);
    // Simulate a payment/processing round trip — there is no real backend.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsProcessing(false);
    setIsConfirmed(true);
    clearCart();
  }

  if (isConfirmed) {
    return (
      <div className="checkout-confirmation">
        <h1>Order confirmed 🎉</h1>
        <p>Thanks, {values.name.split(' ')[0]}! A confirmation would normally be emailed to {values.email}.</p>
        <Link to="/" className="checkout-confirmation__link">
          Continue shopping →
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h1>Nothing to check out</h1>
        <p>Your cart is empty, so there's nothing to pay for yet.</p>
        <Link to="/">← Back to products</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-page__grid">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <div className="checkout-form__field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={values.name}
              onChange={(event) => handleChange('name', event.target.value)}
              onBlur={() => handleBlur('name')}
              aria-invalid={Boolean(touched.name && errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {touched.name && errors.name && (
              <p className="checkout-form__error" id="name-error">{errors.name}</p>
            )}
          </div>

          <div className="checkout-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) => handleChange('email', event.target.value)}
              onBlur={() => handleBlur('email')}
              aria-invalid={Boolean(touched.email && errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {touched.email && errors.email && (
              <p className="checkout-form__error" id="email-error">{errors.email}</p>
            )}
          </div>

          <div className="checkout-form__field">
            <label htmlFor="address">Shipping address</label>
            <textarea
              id="address"
              rows="3"
              value={values.address}
              onChange={(event) => handleChange('address', event.target.value)}
              onBlur={() => handleBlur('address')}
              aria-invalid={Boolean(touched.address && errors.address)}
              aria-describedby={errors.address ? 'address-error' : undefined}
            />
            {touched.address && errors.address && (
              <p className="checkout-form__error" id="address-error">{errors.address}</p>
            )}
          </div>

          <div className="checkout-form__field">
            <label htmlFor="cardNumber">Card number</label>
            <input
              id="cardNumber"
              type="text"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={values.cardNumber}
              onChange={(event) => handleChange('cardNumber', event.target.value)}
              onBlur={() => handleBlur('cardNumber')}
              aria-invalid={Boolean(touched.cardNumber && errors.cardNumber)}
              aria-describedby={errors.cardNumber ? 'card-error' : undefined}
            />
            {touched.cardNumber && errors.cardNumber && (
              <p className="checkout-form__error" id="card-error">{errors.cardNumber}</p>
            )}
            <p className="checkout-form__hint">This is a demo — no real payment is processed.</p>
          </div>

          <button type="submit" className="checkout-form__submit" disabled={isProcessing}>
            {isProcessing ? 'Processing…' : `Place order — $${subtotal.toFixed(2)}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="checkout-summary__total">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
