import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>MENU</h3>

      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/movies">Movies</NavLink>
      <NavLink to="/categories">Categories</NavLink>
      <NavLink to="/watchlist">Watchlist</NavLink>
      <NavLink to="/reviews">Reviews</NavLink>
      <NavLink to="/manage">Manage Movies</NavLink>
    </aside>
  );
}

export default Sidebar;