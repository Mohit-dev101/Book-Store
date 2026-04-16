import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await signup(name.trim(), email.trim().toLowerCase(), password, role);
    setLoading(false);

    if (result.success) {
      if (role === 'seller') {
        navigate('/seller/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/buyer/browse');
      }
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="auth-page" id="signup-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h2>📚 BookMart</h2>
          <p>Create your account</p>
        </div>

        {error && (
          <div className="alert alert-error" id="signup-error">
            ⚠️ {error}
          </div>
        )}

        <div className="role-selector" id="role-selector">
          <div
            className={`role-option ${role === 'buyer' ? 'active' : ''}`}
            onClick={() => setRole('buyer')}
            id="role-buyer"
          >
            <div className="role-icon">🛒</div>
            <div className="role-name">Buyer</div>
            <div className="role-desc">Browse & buy books</div>
          </div>
          <div
            className={`role-option ${role === 'seller' ? 'active' : ''}`}
            onClick={() => setRole('seller')}
            id="role-seller"
          >
            <div className="role-icon">🏪</div>
            <div className="role-name">Seller</div>
            <div className="role-desc">List & sell books</div>
          </div>
          <div
            className={`role-option ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
            id="role-admin"
          >
            <div className="role-icon">🛡️</div>
            <div className="role-name">Admin</div>
            <div className="role-desc">Manage platform</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} id="signup-form">
          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Full Name</label>
            <input
              type="text"
              id="signup-name"
              className="form-input"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email Address</label>
            <input
              type="email"
              id="signup-email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <input
              type="password"
              id="signup-password"
              className="form-input"
              placeholder="Create a password (min. 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading} id="signup-submit">
            {loading ? 'Creating Account...' : `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}
