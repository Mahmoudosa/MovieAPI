import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAppData } from '../hooks/useAppData';

function UserLayout() {
  const { apiLoading, apiError } = useAppData();

  return (
    <div className="app">
      <Navbar />
      {apiLoading && <p className="muted-copy" role="status">Loading your account data…</p>}
      {apiError && <p className="error-message" role="alert">{apiError}</p>}

      <div className="layout">
        <Sidebar />

        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;