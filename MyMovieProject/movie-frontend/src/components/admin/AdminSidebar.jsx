import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', icon: '⌂', end: true },
  { to: '/admin/movies', label: 'Manage Movies', icon: '▤' },
  { to: '/admin/categories', label: 'Categories', icon: '◫' },
  { to: '/admin/users', label: 'Users', icon: '♙' },
  { to: '/admin/reviews', label: 'Moderate Reviews', icon: '✎' }
];

function AdminSidebar() {
  return (
    <aside className="portal-sidebar">
      <span className="portal-nav-label">ADMIN WORKSPACE</span>
      <nav aria-label="Admin navigation">
        {links.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            <span className="nav-icon" aria-hidden="true">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <LinkBack />
    </aside>
  );
}

function LinkBack() {
  return (
    <NavLink className="portal-back" to="/">
      <span aria-hidden="true">←</span> Back to User Interface
    </NavLink>
  );
}

export default AdminSidebar;
