import { apiRequest } from './apiClient';

export function getWatchlists() {
  return apiRequest('/api/watchlists');
}

export function getWatchlist(id) {
  return apiRequest(`/api/watchlists/${id}`);
}

export function createWatchlistItem(item) {
  return apiRequest('/api/watchlists', {
    method: 'POST',
    body: JSON.stringify(item)
  });
}

export function updateWatchlistItem(id, item) {
  return apiRequest(`/api/watchlists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item)
  });
}

export function deleteWatchlistItem(id) {
  return apiRequest(`/api/watchlists/${id}`, { method: 'DELETE' });
}
