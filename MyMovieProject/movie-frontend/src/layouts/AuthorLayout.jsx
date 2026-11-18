import { Link, Outlet } from 'react-router-dom';
import AuthorSidebar from '../components/author/AuthorSidebar';
import DevelopmentRoleSwitcher from '../components/DevelopmentRoleSwitcher';

function AuthorLayout() {
  return (
    <div className="app portal-app">
      <header className="portal-header">
        <Link className="brand" to="/author">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>MyMovie<span>App</span></span>
          <span className="portal-badge author-badge">AUTHOR DEMO</span>
        </Link>
        <div className="portal-header-actions">
          <span className="demo-warning">Editorial preview · Mock content only</span>
          <DevelopmentRoleSwitcher />
          <span className="avatar-link" aria-label="Demo author">SA</span>
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
