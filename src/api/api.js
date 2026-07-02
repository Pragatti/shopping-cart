const BASE_URL = 'https://fakestoreapi.com';

/**
 * Thin wrapper around fetch that normalizes error handling for the app.
 * Every function here throws a plain Error with a human-readable message
 * on failure, so calling hooks can catch one error shape.
 */
async function request(path) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`);
  } catch {
    throw new Error('Network error — check your connection and try again.');
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${path}`);
  }

  return response.json();
}

export function fetchProducts() {
  return request('/products');
}

export function fetchProductById(id) {
  return request(`/products/${id}`);
}

export function fetchCategories() {
  return request('/products/categories');
}

export function fetchProductsByCategory(category) {
  return request(`/products/category/${encodeURIComponent(category)}`);
}
