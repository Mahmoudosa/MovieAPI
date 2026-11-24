import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import AuthorSidebar from '../components/author/AuthorSidebar';
import DevelopmentRoleSwitcher from '../components/DevelopmentRoleSwitcher';
import { useAuth } from '../hooks/useAuth';

function AuthorLayout() {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'Author') return <Navigate to="/" replace />;

  return (
    <div className="app portal-app">
      <header className="portal-header">
        <Link className="brand" to="/author">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>MyMovie<span>App</span></span>
          <span className="portal-badge author-badge">MOVIE AUTHOR</span>
        </Link>
        <div className="portal-header-actions">
          <span className="demo-warning">{user.userName}</span>
          <DevelopmentRoleSwitcher />
          <span className="avatar-link" aria-label={`Author ${user.userName}`}>
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
        <AuthorSidebar />
        <Outlet />
      </div>
    </div>
  );
}

export default AuthorLayout;
