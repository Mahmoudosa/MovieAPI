import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DevelopmentRoleSwitcher from './DevelopmentRoleSwitcher';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useAuth();

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`/movies${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ''}`);
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/" aria-label="MyMovieApp home">
        <span className="brand-mark" aria-hidden="true">M</span>
        <span>MyMovie<span>App</span></span>
      </Link>

      <div className="nav-actions">
        <form className="navbar-search" onSubmit={submitSearch} role="search">
          <label className="visually-hidden" htmlFor="navbar-search">Search movies</label>
          <input
            id="navbar-search"
            type="search"
            placeholder="Search movies..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" aria-label="Search">⌕</button>
        </form>
        {isAuthenticated ? (
          <button
            className="button button-primary nav-login"
            type="button"
            onClick={() => {
              signOut();
              navigate('/', { replace: true });
            }}
          >
            Log out
          </button>
        ) : (
          <Link className="button button-primary nav-login" to="/login">
            Login
          </Link>
        )}
        <DevelopmentRoleSwitcher />
        <Link className="avatar-link" to="/profile" aria-label="View profile">
          {isAuthenticated && user?.userName
            ? user.userName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
            : 'MF'}
        </Link>
      </div>
    </header>
  );
}

export default Navbar;