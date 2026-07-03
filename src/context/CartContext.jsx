import { createContext, useState, useEffect } from 'react';

const CART_KEY = 'quickcart-cart';

const CartContext = createContext(null);

function loadItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return saved?.items ?? [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadItems);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify({ items }));
  }, [items]);

  function addToCart(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity,
        },
      ];
    });
  }

  function changeQuantity(productId, quantity) {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  let totalItems = 0;
  let subtotal = 0;

  for (const item of items) {
    totalItems += item.quantity;
    subtotal += item.price * item.quantity;
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addToCart,
        changeQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
