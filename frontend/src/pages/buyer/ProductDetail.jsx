import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts, getCategoryIcon } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = getProductById(id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="page container" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😕</div>
        <h2>Product Not Found</h2>
        <p style={{ marginBottom: '24px' }}>This product may have been removed or doesn't exist.</p>
        <Link to="/buyer/browse" className="btn btn-primary">← Back to Browse</Link>
      </div>
    );
  }

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="page container slide-up" id="product-detail-page">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '24px' }}
        id="back-btn"
      >
        ← Back
      </button>

      <div className="product-detail">
        <div className="product-img-container">
          {product.image ? (
            <img src={product.image} alt={product.title} />
          ) : (
            getCategoryIcon(product.category)
          )}
        </div>

        <div className="product-info">
          <span className="badge badge-primary" style={{ marginBottom: '16px' }}>
            {product.category}
          </span>
          <h1>{product.title}</h1>
          <p className="author">by {product.author}</p>
          <div className="price">₹{product.price}</div>

          {product.description && (
            <p className="description">{product.description}</p>
          )}

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Seller</span>
              <span className="meta-value">{product.sellerName}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Listed On</span>
              <span className="meta-value">
                {new Date(product.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} id="qty-minus">−</button>
              <span className="qty-value">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} id="qty-plus">+</button>
            </div>
            <button
              className={`btn ${added ? 'btn-success' : 'btn-primary'} btn-lg`}
              onClick={handleAddToCart}
              style={{ flex: 1 }}
              id="add-to-cart-btn"
            >
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
