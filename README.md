# Shopping Cart E-Commerce

A modern, fully-featured e-commerce shopping cart application built with React, Vite, and the FakeStore API. Features product browsing with filtering, search, sorting, and a persistent shopping cart.

## Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup & Run from Clean Clone

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Other Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter (oxlint)
npm run lint
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

**Why**:
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

**Advantages**:
- **Works offline**: Users can browse and prepare cart without internet
- **No backend required**: Reduces server load and complexity
- **Instant retrieval**: No network latency on page load
- **User-friendly**: Cart persists across browser sessions

**Limitations**:
- Limited to ~5-10MB per domain (browser dependent)
- Not synced across devices
- Clears if user clears browser data

### Pagination Strategy: Server-Side Pagination

**Choice**: Traditional pagination (not infinite scroll)

**Why**:
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

## Future Improvements & Enhancements

With more time, these features would enhance the experience:

### 1. **Backend Integration**
- Move cart persistence to a backend database
- Enable cross-device cart syncing (logged-in users)
- Real inventory management and stock validation

### 2. **User Accounts**
- User authentication and registration
- Order history and saved items
- Wishlist / saved for later functionality

### 3. **Performance Optimizations**
- Image lazy loading and optimization (Intersection Observer)
- Component code-splitting for faster initial load
- Implement React Query/SWR for improved data fetching and caching
- Add service worker for offline support

### 4. **Enhanced Checkout**
- Multiple payment methods (credit card, PayPal, etc.)
- Address book and saved payment methods
- Order status tracking
- Email notifications

### 5. **Analytics & Business Features**
- Track user behavior (Google Analytics)
- A/B testing for UI variations
- Product recommendations based on browsing/purchase history
- Discount codes and promotional campaigns

### 6. **Testing**
- Unit tests (Vitest)
- Integration tests (Testing Library)
- E2E tests (Playwright)
- Accessibility audits and fixes

### 7. **Developer Experience**
- TypeScript for type safety
- Storybook for component documentation
- Error boundary component for better error handling
- Better form validation library (react-hook-form is installed but could be leveraged more)

## Technologies Used

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 19 | Component-based UI |
| **Build Tool** | Vite | Fast dev server & bundling |
| **Routing** | React Router v7 | Client-side navigation |
| **State** | Context API | Cart state management |
| **Forms** | react-hook-form | Form handling (installed for checkout) |
| **Linter** | oxlint | Code quality |
| **API** | FakeStore API | Mock product data |

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Open source
