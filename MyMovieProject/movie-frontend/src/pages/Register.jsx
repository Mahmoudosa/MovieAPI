import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/authService';

function Register() {
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitRegister = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({
        userName: form.userName.trim(),
        email: form.email.trim(),
        password: form.password
      });
      setSuccess('Your account was created. You can now sign in.');
      setForm({ userName: '', email: '', password: '', confirmPassword: '' });
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
        <span className="eyebrow">JOIN THE COMMUNITY</span>
        <h1>Create your account</h1>
        <p>Save your favorites and share your movie reviews.</p>

        <form onSubmit={submitRegister}>
          <div className="form-field">
            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              type="text"
              autoComplete="username"
              minLength="2"
              maxLength="40"
              placeholder="Choose a username"
              value={form.userName}
              onChange={(event) => setForm({ ...form, userName: event.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>
            <div className="password-input">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                minLength="12"
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
            <span className="field-hint">Use at least 12 characters.</span>
          </div>
          <div className="form-field">
            <label htmlFor="register-confirm-password">Confirm password</label>
            <input
              id="register-confirm-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength="12"
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              required
            />
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
          {success && <p className="success-message" role="status">{success}</p>}
          <button className="button button-primary auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        <Link className="auth-back" to="/">← Back to home</Link>
      </div>
    </main>
  );
}

export default Register;
