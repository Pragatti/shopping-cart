# Marketstand — Product Catalog & Shopping Cart

A single-page React app built against the [Fake Store API](https://fakestoreapi.com). Users can browse products, search and filter them, view product details, manage a cart, and check out with a validated form.

## Setup & run

Requires Node.js 18+.

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

No environment variables or backend are needed — the app talks directly to `https://fakestoreapi.com`.

## Project structure

```
src/
  api/            fetch wrappers for the Fake Store API (single source of truth for endpoints)
  components/     reusable, single-responsibility UI pieces (ProductCard, Header, FilterBar, ...)
  context/        CartContext — the one piece of app-wide shared state
  hooks/          useProducts, useCategories, useProductDetail, useCart, useDebounce
  pages/          route-level components (ProductListPage, ProductDetailPage, CartPage, CheckoutPage)
  utils/          pure helper functions (checkout validation, sort options)
  styles/         global design tokens (CSS variables) and base styles
```

Each component/page pairs with its own CSS file rather than one global stylesheet, so styles stay scoped to where they're used and are easy to delete along with the component.

## State management: Context + `useReducer`, not Redux

The cart is the only state that's genuinely shared across the app (header badge, cart page, checkout page all need it), so it lives in `CartContext` + a `useReducer` reducer (`ADD_ITEM`, `SET_QUANTITY`, `REMOVE_ITEM`, `CLEAR_CART`). Everything else — search text, selected category, sort order, pagination — is either local `useState` in the component that owns it, or lifted into the URL via `useSearchParams`.

Why not Redux/Zustand: the app has exactly one cross-cutting piece of state and a handful of well-defined actions. Context + `useReducer` gives the same "actions describe state changes" model Redux is known for, with zero extra dependencies. I'd reach for Redux/Zustand if there were multiple independent slices of shared state, needed middleware (logging, persistence middleware, undo), or the update logic got complex enough that Redux DevTools time-travel debugging would earn its keep.

Filter/sort/search state lives in the URL (`?q=&category=&sort=&page=`) instead of component state or context. That makes the listing page's state shareable and back/forward-button friendly for free, and keeps it out of global state entirely since nothing else in the app needs it.

## Cart persistence

The cart is persisted to `localStorage` (`marketstand.cart.v1`) via a `useEffect` in `CartProvider` that runs on every state change. On load, the reducer's initial state is computed by reading and parsing that key (falling back to an empty cart if it's missing, corrupt, or storage is unavailable — e.g. private browsing). This was the simplest mechanism that satisfies "persist across refreshes" without a backend; the trade-off is it's per-browser only (no cross-device sync), which would need a real backend or an authenticated API to solve.

## Pagination vs. infinite scroll

I chose **pagination** over infinite scroll:

- The Fake Store API returns the full product list in one call (no server-side paging), so "infinite scroll" here would really mean progressively revealing already-fetched, already-filtered client-side data — it doesn't save any network cost and starts to feel like a solution in search of a problem for a ~20-item catalog.
- Pagination keeps scroll position and page number as explicit, addressable state, is easier to test and reason about, and is more accessible (keyboard/screen-reader users get clear "page 2 of 3" context instead of content silently appending below the fold).
- With a small, fixed dataset, the UX difference is minor either way; pagination was the lower-complexity choice that meets the requirement.

## Async state handling

Every data-fetching hook (`useProducts`, `useCategories`, `useProductDetail`) exposes an explicit `status` (`loading` | `success` | `error`, plus `not-found` for the detail page) rather than inferring state from `data === null`. Pages render a loader, an `ErrorMessage` with a retry action, a not-found message, or the real content based on that status — there's no path that leaves a blank screen. The product list additionally has an explicit **empty** state (zero results after filtering) that's distinct from the error state.

## Performance notes

- `ProductCard` is wrapped in `React.memo` since the grid can render many cards and most page-level state changes (typing in the search box, toggling sort) don't change any individual card's props.
- The cart's derived values (`itemCount`, `subtotal`) and the context value object are memoized with `useMemo`, and the reducer action dispatchers are wrapped in `useCallback`, so consumers of `useCart` don't get new function identities on every render.
- Filtering/sorting/pagination of the product list is done in a single `useMemo` keyed on the actual inputs that affect it (products, category, search term, sort), so typing in the search box doesn't re-filter until the debounced value actually changes.
- Search input is debounced (350ms via `useDebounce`) before it's applied to the URL/filter, so the list isn't re-filtered on every keystroke.

## Accessibility basics covered

- Semantic elements (`header`, `main`, `nav`, `article`, `aside`, `footer`), a `role="search"` form, and list semantics (`ul`/`li`) for the product grid and cart.
- All images have descriptive `alt` text; decorative icons are `aria-hidden`.
- All form inputs have associated `<label>`s (visually hidden where the design calls for icon-only or placeholder-driven inputs).
- Checkout errors are linked to their inputs via `aria-describedby` and `aria-invalid`.
- Visible focus outline on all interactive elements (see `:focus-visible` in `tokens.css`), and `prefers-reduced-motion` is respected.
- Cart quantity controls and the product detail quantity stepper are reachable and operable by keyboard, not just click/drag.

## What I'd do differently with more time

- Add automated tests (React Testing Library for components/hooks — the cart reducer logic and the checkout validator are both pure enough to unit test cheaply).
- Extract the checkout form into a small reusable `useForm` hook if more forms were added — right now the validate-on-blur logic is hand-rolled directly in `CheckoutPage`, which is fine at one form but wouldn't scale to a second.
- Add a toast/notification system for "added to cart" instead of the current inline button-label swap.
- Consider `react-query`/SWR for caching and refetching if the app grew additional data-fetching needs beyond the three simple hooks it has now — at this size, plain `useEffect` hooks are easier to read than the abstraction would justify.
- Add category-aware breadcrumbs and a slide-over cart panel (rather than a full page) for faster add-to-cart feedback.

## Dependencies

- **react-router-dom** — client-side routing for the four pages.
- Everything else is plain CSS + React. No UI kit or CSS framework: at this scope, hand-written CSS files scoped per component were faster to get right and easier to fully explain than configuring Tailwind or pulling in a component library.
