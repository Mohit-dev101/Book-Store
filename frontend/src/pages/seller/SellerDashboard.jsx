import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts, getCategoryIcon } from '../../context/ProductContext';

export default function SellerDashboard() {
  const { currentUser } = useAuth();
  const { getSellerProducts, products } = useProducts();

  const myProducts = getSellerProducts(currentUser.id);
  const totalRevenue = myProducts.reduce((sum, p) => sum + p.price, 0);
  const totalProducts = myProducts.length;
  const categories = [...new Set(myProducts.map(p => p.category))].length;

  return (
    <div className="page container slide-up" id="seller-dashboard">
      <div className="page-header">
        <h1>Welcome back, {currentUser.name}! 👋</h1>
        <p>Here's an overview of your store.</p>
      </div>

      <div className="seller-stats">
        <div className="card stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Listing Value</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-value">{categories}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">Total on Platform</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <Link to="/seller/add-product" className="btn btn-primary" id="dash-add-product">
          ➕ Add New Product
        </Link>
        <Link to="/seller/my-products" className="btn btn-secondary" id="dash-my-products">
          📦 View My Products
        </Link>
      </div>

      {myProducts.length > 0 && (
        <div className="card" id="recent-products">
          <h3 style={{ marginBottom: '20px' }}>Recent Products</h3>
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {myProducts.slice(-5).reverse().map(product => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {myProducts.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
          <h3>No products yet</h3>
          <p style={{ marginBottom: '24px' }}>Start selling by adding your first book or study material!</p>
          <Link to="/seller/add-product" className="btn btn-primary">
            ➕ Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
}
