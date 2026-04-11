import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;
function getToken() {
  return localStorage.getItem('bookmart_token');
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [actionMsg, setActionMsg] = useState('');

  function fetchProducts() {
    setLoading(true);
    fetch(`${API}/api/admin/products`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProducts(d.products);
        else setError(d.error);
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }

  useEffect(fetchProducts, []);

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`${API}/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (data.success) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showMsg('✅ Product deleted');
    } else {
      showMsg(`❌ ${data.error}`);
    }
  }

  function showMsg(msg) {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3000);
  }

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p>Loading products…</p></div>;
  if (error) return <div className="admin-error">⚠️ {error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Product Management</h1>
        <p className="admin-page-subtitle">{products.length} products listed</p>
      </div>

      {actionMsg && <div className="admin-action-toast">{actionMsg}</div>}

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search-wrap">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search"
            placeholder="Search title, author or seller…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-tabs">
          {categories.map((c) => (
            <button
              key={c}
              className={`admin-filter-tab${filterCat === c ? ' active' : ''}`}
              onClick={() => setFilterCat(c)}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
              <span className="admin-filter-count">
                {c === 'all' ? products.length : products.filter((p) => p.category === c).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Products grid + table toggle */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Seller</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="admin-empty">No products found</td></tr>
              ) : (
                filtered.map((p, idx) => (
                  <tr key={p._id}>
                    <td className="admin-td-muted">{idx + 1}</td>
                    <td>
                      <div className="admin-product-cell">
                        {p.image ? (
                          <img src={p.image} alt={p.title} className="admin-product-thumb" />
                        ) : (
                          <div className="admin-product-thumb-placeholder">📚</div>
                        )}
                        <strong>{p.title}</strong>
                      </div>
                    </td>
                    <td className="admin-td-muted">{p.author}</td>
                    <td><span className="admin-badge admin-badge-category">{p.category}</span></td>
                    <td><strong>₹{p.price}</strong></td>
                    <td className="admin-td-muted">{p.sellerName}</td>
                    <td className="admin-td-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDelete(p._id, p.title)}
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
