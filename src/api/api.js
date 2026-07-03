const API = 'https://fakestoreapi.com';

async function get(path) {
  let res;

  try {
    res = await fetch(`${API}${path}`);
  } catch {
    throw new Error('Could not reach the server');
  }

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  return res.json();
}

export function fetchProducts() {
  return get('/products');
}

export function fetchProductById(id) {
  return get(`/products/${id}`);
}

export function fetchCategories() {
  return get('/products/categories');
}

export function fetchProductsByCategory(category) {
  return get(`/products/category/${encodeURIComponent(category)}`);
}
