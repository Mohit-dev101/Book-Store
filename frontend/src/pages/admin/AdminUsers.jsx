import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;
function getToken() {
  return localStorage.getItem('bookmart_token');
}

const ROLE_OPTIONS = ['buyer', 'seller', 'admin'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [actionMsg, setActionMsg] = useState('');

  function fetchUsers() {
    setLoading(true);
    fetch(`${API}/api/admin/users`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setUsers(d.users);
        else setError(d.error);
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }

  useEffect(fetchUsers, []);

  async function handleRoleChange(userId, newRole) {
    const res = await fetch(`${API}/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    const data = await res.json();
    if (data.success) {
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      showMsg('✅ Role updated successfully');
    } else {
      showMsg(`❌ ${data.error}`);
    }
  }

  async function handleDelete(userId, userName) {
    if (!window.confirm(`Delete user "${userName}"? This will also delete their products.`)) return;
    const res = await fetch(`${API}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (data.success) {
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      showMsg('✅ User deleted');
    } else {
      showMsg(`❌ ${data.error}`);
    }
  }

  function showMsg(msg) {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3000);
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p>Loading users…</p></div>;
  if (error) return <div className="admin-error">⚠️ {error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">User Management</h1>
        <p className="admin-page-subtitle">{users.length} registered users</p>
      </div>

      {actionMsg && <div className="admin-action-toast">{actionMsg}</div>}

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search-wrap">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-tabs">
          {['all', 'buyer', 'seller', 'admin'].map((r) => (
            <button
              key={r}
              className={`admin-filter-tab${filterRole === r ? ' active' : ''}`}
              onClick={() => setFilterRole(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
              <span className="admin-filter-count">
                {r === 'all' ? users.length : users.filter((u) => u.role === r).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="admin-empty">No users found</td></tr>
              ) : (
                filtered.map((u, idx) => (
                  <tr key={u._id}>
                    <td className="admin-td-muted">{idx + 1}</td>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-mini-avatar">{u.name.charAt(0).toUpperCase()}</div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td className="admin-td-muted">{u.email}</td>
                    <td>
                      <select
                        className={`admin-role-select admin-badge-${u.role}`}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="admin-td-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDelete(u._id, u.name)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
