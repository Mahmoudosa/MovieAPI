const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5227';

async function postAuth(path, payload) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    throw new Error('Could not reach the API. Check that the backend is running.');
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
      : result?.detail || result?.title || result?.message || 'The request could not be completed.';
    throw new Error(message);
  }

  return result;
}

export function login(credentials) {
  return postAuth('login', credentials);
}

export function register(account) {
  return postAuth('register', account);
}