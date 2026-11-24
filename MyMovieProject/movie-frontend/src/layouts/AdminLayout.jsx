import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import DevelopmentRoleSwitcher from '../components/DevelopmentRoleSwitcher';
import { useAuth } from '../hooks/useAuth';

function AdminLayout() {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'Admin') return <Navigate to="/" replace />;

  return (
    <div className="app portal-app">
      <header className="portal-header">
        <Link className="brand" to="/admin">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>MyMovie<span>App</span></span>
          <span className="portal-badge admin-badge">ADMIN</span>
        </Link>
        <div className="portal-header-actions">
          <span className="demo-warning">{user.userName}</span>
          <DevelopmentRoleSwitcher />
          <span className="avatar-link" aria-label={`Administrator ${user.userName}`}>
            {user.userName.slice(0, 2).toUpperCase()}
          </span>
          <button
            className="button button-quiet portal-logout"
            type="button"
            onClick={() => {
              signOut();
              navigate('/login', { replace: true });
            }}
          >
            Log out
          </button>
        </div>
      </header>
      <div className="portal-layout">
        <AdminSidebar />
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
