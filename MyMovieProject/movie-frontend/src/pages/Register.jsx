
import { Link } from 'react-router-dom';

function Register() {
  return (
    <main className="content">
      <div className="auth-container">
        <h1>Create Account</h1>
        <p>Join MyMovieApp today.</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Choose a username"
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            required
          />

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
