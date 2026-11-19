import { apiRequest } from './apiClient';

export function getMovies() {
  return apiRequest('/api/movies');
}

export function getMovie(id) {
  return apiRequest(`/api/movies/${id}`);
}

export function createMovie(movie) {
  return apiRequest('/api/movies', {
    method: 'POST',
    body: JSON.stringify(movie)
  });
}

export function updateMovie(id, movie) {
  return apiRequest(`/api/movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(movie)
  });
}

export function deleteMovie(id) {
  return apiRequest(`/api/movies/${id}`, { method: 'DELETE' });
}