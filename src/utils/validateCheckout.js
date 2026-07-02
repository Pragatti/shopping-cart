const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the checkout form fields and returns a map of
 * { fieldName: errorMessage } for any invalid fields. An empty object
 * means the form is valid.
 */
export function validateCheckout(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Enter your full name.';
  }

  if (!values.email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.address.trim()) {
    errors.address = 'Enter your shipping address.';
  } else if (values.address.trim().length < 8) {
    errors.address = 'Enter a complete address.';
  }

  const digitsOnly = values.cardNumber.replace(/\s+/g, '');
  if (!digitsOnly) {
    errors.cardNumber = 'Enter your card number.';
  } else if (!/^\d{13,19}$/.test(digitsOnly)) {
    errors.cardNumber = 'Card number must be 13–19 digits.';
  }

  return errors;
}
