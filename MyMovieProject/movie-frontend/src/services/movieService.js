import { apiRequest } from './apiClient';

export function getMovies() {
  return apiRequest('/api/movies');
}

export function searchMovies({ search, categoryId, page = 1, pageSize = 20, signal }) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize)
  });
  if (search?.trim()) params.set('search', search.trim());
  if (categoryId !== 'all') params.set('categoryId', String(categoryId));

  return apiRequest(`/api/movies/search?${params}`, { signal });
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