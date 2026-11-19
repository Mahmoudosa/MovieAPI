import { NavLink } from 'react-router-dom';

const links = [
  { to: '/author', label: 'Dashboard', icon: '⌂', end: true },
  { to: '/author/articles', label: 'My Articles', icon: '▤' },
  { to: '/author/articles/new', label: 'Create Article', icon: '＋' },
  { to: '/author/movies', label: 'Add Movie', icon: '▣' },
  { to: '/author/profile', label: 'Profile', icon: '◉' }
];

function AuthorSidebar() {
  return (
    <aside className="portal-sidebar">
      <span className="portal-nav-label">EDITORIAL STUDIO</span>
      <nav aria-label="Author navigation">
        {links.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            <span className="nav-icon" aria-hidden="true">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <NavLink className="portal-back" to="/">
        <span aria-hidden="true">←</span> Back to User Interface
      </NavLink>
    </aside>
  );
}

export default AuthorSidebar;
