import { useLocation, useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';

const roleDestinations = {
  User: '/',
  Admin: '/admin',
  Author: '/author'
};

function DevelopmentRoleSwitcher() {
  const { setDemoRole } = useAppData();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!import.meta.env.DEV) return null;
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
