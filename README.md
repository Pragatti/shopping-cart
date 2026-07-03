# Shopping Cart E-Commerce

A modern, fully-featured e-commerce shopping cart application built with React, Vite, and the FakeStore API. Features product browsing with filtering, search, sorting, and a persistent shopping cart.

## Quick Start

### Setup & Run from Clean Clone

```bash

npm install


npm run dev
```




## Project Structure

```
src/
├── api/              # API integration (FakeStore API)
├── components/       # Reusable React components
├── context/          # React Context for state management
├── hooks/            # Custom React hooks
├── layout/           # Layout wrapper component
├── pages/            # Page components for routing
├── styles/           # Global styles and design tokens
└── utils/            # Utility functions
```

## Architecture & Technical Decisions

### State Management: React Context API

**Choice**: React Context API with `useContext` hook pattern

- **Simplicity**: Cart is a single, focused piece of state—Context API is ideal for this without overhead
- **No external dependencies**: Keeps the bundle small and dependencies minimal
- **Sufficient for scale**: Perfect for a shopping cart app without complex nested state updates
- **Developer experience**: Built-in to React, no learning curve for standard patterns

The cart state is managed in [CartContext.jsx](src/context/CartContext.jsx), which provides:
- `items` - array of cart items
- `totalItems` - total quantity of items
- `subtotal` - total price
- `addToCart()`, `changeQuantity()`, `removeFromCart()`, `clearCart()` - cart operations

### Cart Persistence: localStorage

**Implementation**: Cart automatically persists to browser localStorage under the key `quickcart-cart`

**How it works**:
- On app load, [CartContext](src/context/CartContext.jsx) loads saved cart from localStorage (with error handling)
- Any cart changes trigger an `useEffect` that saves to localStorage
- If localStorage is unavailable or corrupted, the cart gracefully falls back to an empty state


### Pagination Strategy: Server-Side Pagination

**Choice**: Traditional pagination (not infinite scroll)

- **Better UX for browsing**: Clear progress indicator ("Page 2 of 5") helps users navigate
- **Performance**: Only 8 items rendered at a time, regardless of total products
- **SEO-friendly**: Each page state is preserved in URL query params, allowing bookmarking/sharing
- **Predictable scroll position**: Users don't get lost as content loads; they control navigation

**Configuration**:
- **Items per page**: 8 (configured in [ProductListPage.jsx](src/pages/ProductListPage.jsx))
- **URL parameters**: `?page=2&q=shirt&category=electronics&sort=price-asc`
- **Component**: [Pagination.jsx](src/components/Pagination.jsx) handles page navigation

### Key Features Implemented

✓ **Search** - Real-time search with 350ms debounce (prevents excessive filtering)  
✓ **Category Filter** - Filter by product category  
✓ **Sorting** - Sort by default, price (asc/desc), or rating  
✓ **Product Details** - Individual product pages with full information  
✓ **Responsive Design** - Mobile-first approach with CSS media queries  
✓ **Error Handling** - Graceful error messages for failed API calls  
✓ **Loading States** - Visual feedback during data fetching  
✓ **URL State** - All filters preserved in URL for bookmarking/sharing  

