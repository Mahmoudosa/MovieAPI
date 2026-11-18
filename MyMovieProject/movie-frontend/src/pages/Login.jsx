
import { Link } from 'react-router-dom';

function Login() {
  return (
    <main className="content">
      <div className="auth-container">
        <h1>Welcome Back</h1>
        <p>Login to your MyMovieApp account.</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?{' '}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
