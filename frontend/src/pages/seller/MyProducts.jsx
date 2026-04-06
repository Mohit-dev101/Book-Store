import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProducts, getCategoryIcon, CATEGORIES } from '../../context/ProductContext';

export default function MyProducts() {
  const { currentUser } = useAuth();
  const { getSellerProducts, updateProduct, deleteProduct } = useProducts();

  const myProducts = getSellerProducts(currentUser.id);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function openEdit(product) {
    setEditingProduct(product.id);
    setEditForm({
      title: product.title,
      author: product.author,
      description: product.description || '',
      price: product.price,
      category: product.category,
      image: product.image || '',
    });
  }

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    updateProduct(editingProduct, {
      ...editForm,
      price: Number(editForm.price),
    });
    setEditingProduct(null);
  }

  function handleDelete(id) {
    deleteProduct(id);
    setDeleteConfirm(null);
  }

  return (
    <div className="page container slide-up" id="my-products-page">
      <div className="page-header">
        <h1>📦 My Products</h1>
        <p>Manage your listed books and study materials.</p>
      </div>

      {myProducts.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
          <h3>No products listed yet</h3>
          <p>You haven't added any products. Start listing now!</p>
        </div>
      )}

      {myProducts.length > 0 && (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-thumb">
                        {getCategoryIcon(product.category)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{product.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {product.author}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{product.category}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-primary-hover)' }}>
                    ₹{product.price}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEdit(product)}
                        id={`edit-${product.id}`}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteConfirm(product.id)}
                        id={`delete-${product.id}`}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} id="edit-modal">
            <h2>✏️ Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  value={editForm.title}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  name="author"
                  className="form-input"
                  value={editForm.author}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  value={editForm.price}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={editForm.category}
                  onChange={handleEditChange}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  value={editForm.description}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  name="image"
                  className="form-input"
                  value={editForm.image}
                  onChange={handleEditChange}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="edit-save">
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }} id="delete-modal">
            <h2>🗑️ Delete Product</h2>
            <p style={{ marginBottom: '24px' }}>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)} id="confirm-delete">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
