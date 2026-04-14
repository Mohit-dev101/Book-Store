import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProducts, getCategoryIcon, CATEGORIES } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

export default function BuyerHome() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'All';
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [addedId, setAddedId] = useState(null);

  const filtered = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, search, category, sortBy]);

  function handleAddToCart(e, product) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div className="page container slide-up" id="buyer-home">
      <div className="page-header">
        <h1>🏪 Browse Books & Materials</h1>
        <p>Find the perfect study materials for your needs.</p>
      </div>

      {/* Search & Filter */}
      <div className="search-bar" id="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by title, author, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-input"
          />
        </div>
        <select
          className="form-select filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          id="category-filter"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="form-select filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          id="sort-filter"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      {/* Results count */}
      <p style={{ marginBottom: '24px', fontSize: '0.9rem' }}>
        Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'result' : 'results'}
        {category !== 'All' && <> in <span className="badge badge-primary" style={{ marginLeft: '8px' }}>{category}</span></>}
      </p>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-4">
          {filtered.map(product => (
            <Link to={`/buyer/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
              <div className="card product-card" id={`product-${product.id}`}>
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.title} />
                  ) : (
                    getCategoryIcon(product.category)
                  )}
                  <span className="badge badge-primary product-category" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    {product.category}
                  </span>
                </div>
                <div className="product-body">
                  <div className="product-title">{product.title}</div>
                  <div className="product-author">by {product.author}</div>
                  <div className="product-footer">
                    <span className="product-price">₹{product.price}</span>
                    <button
                      className={`btn btn-sm ${addedId === product.id ? 'btn-success' : 'btn-primary'}`}
                      onClick={(e) => handleAddToCart(e, product)}
                      id={`add-cart-${product.id}`}
                    >
                      {addedId === product.id ? '✓ Added' : '🛒 Add'}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
