import { NavLink } from 'react-router-dom';

function Sidebar() {
  const links = [
    { to: '/', label: 'Home', icon: '⌂', end: true },
    { to: '/movies', label: 'Movies', icon: '▤' },
    { to: '/watchlist', label: 'My Watchlist', icon: '♡' },
    { to: '/my-reviews', label: 'My Reviews', icon: '✎' },
    { to: '/profile', label: 'My Profile', icon: '◉' }
  ];

  return (
    <aside className="sidebar">
      <h3>USER MENU</h3>
      <nav aria-label="Main navigation">
        {links.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            <span className="nav-icon" aria-hidden="true">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-note">
        <span>YOUR COLLECTION</span>
        <p>Keep all your movie discoveries in one place.</p>
      </div>
    </aside>
  );
}

export default Sidebar;