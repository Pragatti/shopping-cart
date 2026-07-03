import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useCart from '../hooks/useCart';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    defaultValues: { name: '', email: '', address: '', cardNumber: '' },
    mode: 'onBlur',
  });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 800));
    clearCart();
    setDone(true);
  }

  if (done) {
    const { name, email } = getValues();
    const firstName = name.split(' ')[0];

    return (
      <div className="checkout-confirmation">
        <h1>Order placed</h1>
        <p>
          Thanks {firstName}. In a real store we would email {email} a receipt.
        </p>
        <Link to="/" className="checkout-confirmation__link">
          Back to shop
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h1>Checkout</h1>
        <p>Add something to your cart first.</p>
        <Link to="/">Go to shop</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-page__grid">
        <form className="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="checkout-form__field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Required',
                minLength: { value: 3, message: 'Too short' },
              })}
            />
            {errors.name && <p className="checkout-form__error">{errors.name.message}</p>}
          </div>

          <div className="checkout-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
            />
            {errors.email && <p className="checkout-form__error">{errors.email.message}</p>}
          </div>

          <div className="checkout-form__field">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              rows="3"
              {...register('address', {
                required: 'Required',
                minLength: { value: 10, message: 'Too short' },
              })}
            />
            {errors.address && <p className="checkout-form__error">{errors.address.message}</p>}
          </div>

          <div className="checkout-form__field">
            <label htmlFor="cardNumber">Card number</label>
            <input
              id="cardNumber"
              type="text"
              inputMode="numeric"
              placeholder="4242424242424242"
              {...register('cardNumber', {
                required: 'Required',
                pattern: { value: /^\d{16}$/, message: 'Needs 16 digits' },
              })}
            />
            {errors.cardNumber && (
              <p className="checkout-form__error">{errors.cardNumber.message}</p>
            )}
            <p className="checkout-form__hint">Demo only — no payment goes through.</p>
          </div>

          <button type="submit" className="checkout-form__submit" disabled={isSubmitting}>
            {isSubmitting ? 'One sec…' : `Pay $${subtotal.toFixed(2)}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Summary</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.title} x {item.quantity}
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
