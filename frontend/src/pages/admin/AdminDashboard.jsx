import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem('bookmart_token');
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d);
        else setError(d.error);
      })
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p>Loading dashboard…</p></div>;
  if (error) return <div className="admin-error">⚠️ {error}</div>;

  const { stats, recentUsers, recentProducts } = data;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👤', color: 'var(--admin-blue)' },
    { label: 'Buyers', value: stats.buyers, icon: '🛒', color: 'var(--admin-green)' },
    { label: 'Sellers', value: stats.sellers, icon: '🏪', color: 'var(--admin-purple)' },
    { label: 'Total Products', value: stats.totalProducts, icon: '📚', color: 'var(--admin-orange)' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard Overview</h1>
        <p className="admin-page-subtitle">Welcome back, Admin 👋</p>
      </div>

      {/* Stat cards */}
      <div className="admin-stat-grid">
        {statCards.map((card) => (
          <div className="admin-stat-card" key={card.label} style={{ '--card-color': card.color }}>
            <div className="admin-stat-icon">{card.icon}</div>
            <div className="admin-stat-value">{card.value}</div>
            <div className="admin-stat-label">{card.label}</div>
            <div className="admin-stat-bar" />
          </div>
        ))}
      </div>

      {/* Recent tables */}
      <div className="admin-recent-grid">
        {/* Recent Users */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">👥 Recent Users</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`admin-badge admin-badge-${u.role}`}>{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Products */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">📚 Recent Products</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Seller</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => (
                  <tr key={p._id}>
                    <td><strong>{p.title}</strong></td>
                    <td>{p.author}</td>
                    <td>₹{p.price}</td>
                    <td>{p.sellerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
