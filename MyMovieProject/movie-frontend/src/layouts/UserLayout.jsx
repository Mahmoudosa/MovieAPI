import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function UserLayout() {
  return (
    <div className="app">
      <Navbar />

      <div className="layout">
        <Sidebar />

        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;