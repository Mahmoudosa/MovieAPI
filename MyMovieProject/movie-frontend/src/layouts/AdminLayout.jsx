import { Link, Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import DevelopmentRoleSwitcher from '../components/DevelopmentRoleSwitcher';

function AdminLayout() {
  return (
    <div className="app portal-app">
      <header className="portal-header">
        <Link className="brand" to="/admin">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>MyMovie<span>App</span></span>
          <span className="portal-badge admin-badge">ADMIN DEMO</span>
        </Link>
        <div className="portal-header-actions">
          <span className="demo-warning">Demo workspace · No backend permissions</span>
          <DevelopmentRoleSwitcher />
          <span className="avatar-link" aria-label="Demo administrator">AD</span>
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
