import { createContext, useCallback, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/authService';

const AuthContext = createContext(null);
const tokenStorageKey = 'token';

function decodeUser(token) {
  try {
    const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = encodedPayload.padEnd(
      Math.ceil(encodedPayload.length / 4) * 4,
      '='
    );
    const bytes = Uint8Array.from(atob(paddedPayload), (character) => (
      character.charCodeAt(0)
    ));
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    const expiresAt = Number(payload.exp);
    if (!expiresAt || expiresAt * 1000 <= Date.now()) return null;

    const identifier = payload.nameid
      ?? payload.sub
      ?? payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    const roleClaim = payload.role
      ?? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      ?? 'User';
    const normalizedRole = {
      admin: 'Admin',
      author: 'Author',
      user: 'User'
    }[String(roleClaim).trim().toLowerCase()] ?? 'User';

    return {
      id: identifier ? Number(identifier) : null,
      userName: payload.unique_name
        ?? payload.name
        ?? payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        ?? '',
      email: payload.email
        ?? payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
        ?? '',
      role: normalizedRole
    };
  } catch {
    return null;
  }
}

function readSession() {
  const token = window.sessionStorage.getItem(tokenStorageKey);
  const user = token ? decodeUser(token) : null;

  if (!user) {
    window.sessionStorage.removeItem(tokenStorageKey);
    return { token: null, user: null };
  }

  return { token, user };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const signIn = useCallback(async (credentials) => {
    const result = await loginRequest(credentials);
    const token = result?.token ?? result?.Token;
    const user = typeof token === 'string' ? decodeUser(token) : null;

    if (!user) {
      throw new Error('The API returned an invalid or expired login token.');
    }

    window.sessionStorage.setItem(tokenStorageKey, token);
    setSession({ token, user });
    return user;
  }, []);

  const signOut = useCallback(() => {
    window.sessionStorage.removeItem(tokenStorageKey);
    setSession({ token: null, user: null });
  }, []);

  const value = useMemo(() => ({
    token: session.token,
    user: session.user,
    isAuthenticated: Boolean(session.token && session.user),
    signIn,
    signOut
  }), [session, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
