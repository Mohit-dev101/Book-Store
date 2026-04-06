import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  function isActive(path) {
    return location.pathname.startsWith(path) ? 'active' : '';
  }

  // Don't show navbar on auth pages
  if (['/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" id="brand-link">
          <span className="brand-icon">📚</span>
          <span className="brand-text">BookMart</span>
        </Link>

        {!currentUser && (
          <div className="navbar-links">
            <Link to="/login" className={isActive('/login')} id="nav-login">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm" id="nav-signup">
              Sign Up
            </Link>
          </div>
        )}

        {currentUser && currentUser.role === 'seller' && (
          <div className="navbar-links">
            <Link to="/seller/dashboard" className={isActive('/seller/dashboard')} id="nav-seller-dashboard">
              📊 Dashboard
            </Link>
            <Link to="/seller/add-product" className={isActive('/seller/add-product')} id="nav-add-product">
              ➕ Add Product
            </Link>
            <Link to="/seller/my-products" className={isActive('/seller/my-products')} id="nav-my-products">
              📦 My Products
            </Link>
          </div>
        )}

        {currentUser && currentUser.role === 'buyer' && (
          <div className="navbar-links">
            <Link to="/buyer/browse" className={isActive('/buyer/browse')} id="nav-browse">
              🏪 Browse
            </Link>
            <Link to="/buyer/cart" className={isActive('/buyer/cart')} id="nav-cart">
              🛒 Cart {getCartCount() > 0 && `(${getCartCount()})`}
            </Link>
          </div>
        )}

        {currentUser && (
          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="user-name">{currentUser.name}</div>
                <div className="user-role">{currentUser.role}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn" id="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
