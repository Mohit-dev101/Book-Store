import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    if (currentUser.role === 'seller') {
      navigate('/seller/dashboard', { replace: true });
      return null;
    } else {
      navigate('/buyer/browse', { replace: true });
      return null;
    }
  }

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            ✨ The #1 Platform for Academic Books
          </div>
          <h1>
            Buy & Sell <br />
            <span className="gradient-text">Books & Study Materials</span>
          </h1>
          <p className="hero-desc">
            Join thousands of students and educators. Find textbooks, notes, study guides, 
            and educational resources at the best prices — or start selling yours today.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg" id="hero-signup-btn">
              🚀 Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg" id="hero-login-btn">
              Already have an account?
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Books Listed</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">5K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Sellers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section container" id="features-section">
        <h2>Why Choose <span className="gradient-text">BookMart</span>?</h2>
        <div className="grid grid-3">
          <div className="card feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>Safe and trusted marketplace with verified sellers and buyers.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">💰</div>
            <h3>Best Prices</h3>
            <p>Find textbooks at competitive prices. Buy used and save up to 70%.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">📚</div>
            <h3>Wide Selection</h3>
            <p>From engineering to arts, find study materials for every subject.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🏪</div>
            <h3>Easy Selling</h3>
            <p>List your books in minutes. Manage your inventory with a simple dashboard.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Find exactly what you need with category filters and search.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Easy</h3>
            <p>Smooth checkout process. Get your study materials quickly.</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section container" id="categories-section">
        <h2>Browse by <span className="gradient-text">Category</span></h2>
        <div className="grid grid-4">
          {[
            { icon: '💻', name: 'Computer Science', count: '2,400+ books' },
            { icon: '🔬', name: 'Science', count: '1,800+ books' },
            { icon: '📐', name: 'Mathematics', count: '1,500+ books' },
            { icon: '📝', name: 'Language', count: '900+ books' },
            { icon: '⚙️', name: 'Engineering', count: '2,100+ books' },
            { icon: '📊', name: 'Business', count: '1,200+ books' },
            { icon: '🎨', name: 'Arts', count: '600+ books' },
            { icon: '🏛️', name: 'History', count: '800+ books' },
          ].map((cat) => (
            <div className="card category-card" key={cat.name}>
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-count">{cat.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="footer">
        <div className="container">
          <p>
            © 2026 <span className="footer-brand">BookMart</span>. All rights reserved. 
            Built for students, by students.
          </p>
        </div>
      </footer>
    </div>
  );
}
