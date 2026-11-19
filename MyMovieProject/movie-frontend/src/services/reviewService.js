import { apiRequest } from './apiClient';

export function getReviews() {
  return apiRequest('/api/reviews');
}

export function getReview(id) {
  return apiRequest(`/api/reviews/${id}`);
}

export function createReview(review) {
  return apiRequest('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(review)
  });
}

export function updateReview(id, review) {
  return apiRequest(`/api/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(review)
  });
}

export function deleteReview(id) {
  return apiRequest(`/api/reviews/${id}`, { method: 'DELETE' });
}
