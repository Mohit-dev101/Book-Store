import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-brand-icon">🛡️</span>
          <span className="admin-brand-text">Admin Panel</span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-item${isActive ? ' admin-nav-active' : ''}`}>
            <span className="admin-nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item${isActive ? ' admin-nav-active' : ''}`}>
            <span className="admin-nav-icon">👥</span>
            <span>Users</span>
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-item${isActive ? ' admin-nav-active' : ''}`}>
            <span className="admin-nav-icon">📦</span>
            <span>Products</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-pill">
            <div className="admin-user-avatar">{currentUser?.name?.charAt(0).toUpperCase()}</div>
            <div className="admin-user-info">
              <div className="admin-user-name">{currentUser?.name}</div>
              <div className="admin-user-badge">Admin</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
