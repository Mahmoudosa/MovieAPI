import { apiRequest } from './apiClient';

export function getCategories() {
  return apiRequest('/api/categories');
}

export function getCategory(id) {
  return apiRequest(`/api/categories/${id}`);
}

export function createCategory(category) {
  return apiRequest('/api/categories', {
    method: 'POST',
    body: JSON.stringify(category)
  });
}

export function updateCategory(id, category) {
  return apiRequest(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category)
  });
}

export function deleteCategory(id) {
  return apiRequest(`/api/categories/${id}`, { method: 'DELETE' });
}
