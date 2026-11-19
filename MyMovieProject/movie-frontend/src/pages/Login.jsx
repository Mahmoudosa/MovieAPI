import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitLogin = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signIn(form);
      navigate('/movies', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <Link className="auth-brand" to="/">
          <span className="brand-mark" aria-hidden="true">M</span> MyMovieApp
        </Link>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in to your account</h1>
        <p>Pick up where your next movie night begins.</p>

        <form onSubmit={submitLogin}>
          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              maxLength="254"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <div className="password-input">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
          {success && <p className="success-message" role="status">{success}</p>}
          <button className="button button-primary auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">New to MyMovieApp? <Link to="/register">Create an account</Link></p>
        <Link className="auth-back" to="/">← Back to home</Link>
      </div>
    </main>
  );
}

export default Login;
