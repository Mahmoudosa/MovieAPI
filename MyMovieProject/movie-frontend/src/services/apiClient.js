const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5227'
).replace(/\/+$/, '');

export async function apiRequest(path, options = {}) {
  const token = window.sessionStorage.getItem('token');
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Could not connect to ${API_BASE_URL}. Check that the API is running, ` +
        'that the URL uses the correct HTTP/HTTPS scheme, and that CORS allows this frontend.',
        { cause: error }
      );
    }
    throw error;
  }

  const responseText = await response.text();
  let result = null;
  if (responseText) {
    try {
      result = JSON.parse(responseText);
    } catch {
      result = responseText;
    }
  }

  if (!response.ok) {
    const message = typeof result === 'string'
      ? result
      : result?.detail || result?.title || result?.message ||
        Object.values(result?.errors || {}).flat().join(' ') ||
        `API request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return result;
}