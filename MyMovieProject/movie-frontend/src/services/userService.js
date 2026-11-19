import { apiRequest } from './apiClient';

export function getUsers() {
  return apiRequest('/api/users');
}

export function getUser(id) {
  return apiRequest(`/api/users/${id}`);
}

export function createUser(user) {
  return apiRequest('/api/users', {
    method: 'POST',
    body: JSON.stringify(user)
  });
}

export function updateUser(id, user) {
  return apiRequest(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user)
  });
}

export function deleteUser(id) {
  return apiRequest(`/api/users/${id}`, { method: 'DELETE' });
}
