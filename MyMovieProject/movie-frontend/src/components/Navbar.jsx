import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/">
        <h1>MyMovieApp</h1>
      </Link>

      <div className="nav-actions">
        <input type="text" placeholder="Search movies..." />
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;