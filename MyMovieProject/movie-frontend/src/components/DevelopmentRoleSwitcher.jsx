import { useLocation, useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';

const roleDestinations = {
  User: '/',
  Admin: '/admin',
  Author: '/author'
};

function DevelopmentRoleSwitcher() {
  const { setDemoRole } = useAppData();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!import.meta.env.DEV) return null;
  if (isAuthenticated) {
    return (
      <span className="role-switcher" aria-label="Signed-in account role">
        <span>ACCOUNT ROLE</span>
        <strong>{user.role}</strong>
      </span>
    );
  }

  const currentRole = pathname.startsWith('/admin')
    ? 'Admin'
    : pathname.startsWith('/author')
      ? 'Author'
      : 'User';

  const changeRole = (event) => {
    const role = event.target.value;
    setDemoRole(role);
    navigate(roleDestinations[role]);
  };

  return (
    <label className="role-switcher">
      <span>DEV ROLE</span>
      <select value={currentRole} onChange={changeRole} aria-label="Development role switcher">
        <option>User</option>
        <option>Author</option>
        <option>Admin</option>
      </select>
    </label>
  );
}

export default DevelopmentRoleSwitcher;
