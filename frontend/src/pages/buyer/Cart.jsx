import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getCategoryIcon } from '../../context/ProductContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page container slide-up" id="cart-page">
        <div className="cart-empty">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p style={{ marginBottom: '24px' }}>Browse our collection and add some books!</p>
          <Link to="/buyer/browse" className="btn btn-primary">
            🏪 Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <div className="page container slide-up" id="cart-page">
      <div className="page-header">
        <h1>🛒 Shopping Cart</h1>
        <p>{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="card cart-item" key={item.id} id={`cart-item-${item.id}`}>
              <div className="cart-item-image">
                {getCategoryIcon(item.category)}
              </div>
              <div className="cart-item-info">
                <div className="cart-item-title">{item.title}</div>
                <div className="cart-item-author">by {item.author}</div>
                <div className="cart-item-price">₹{item.price}</div>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-selector">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)} id={`remove-${item.id}`}>
                  ✕ Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card cart-summary" id="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span className="label">Subtotal ({getCartCount()} items)</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span className="label">Shipping</span>
            <span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </span>
          </div>
          {shipping > 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Free shipping on orders above ₹500
            </p>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <Link to="/buyer/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '16px' }} id="checkout-btn">
            Proceed to Checkout →
          </Link>
          <Link
            to="/buyer/browse"
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
