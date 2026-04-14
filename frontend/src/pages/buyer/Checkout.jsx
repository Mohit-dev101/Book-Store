import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Checkout() {
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
  const [error, setError] = useState('');

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  function handlePlaceOrder() {
    if (!formData.name.trim() || !formData.address.trim() || !formData.phone.trim()) {
      setError('Please fill in all delivery information fields to place the order.');
      return;
    }
    setError('');

    const newOrderId = 'BM-' + Date.now().toString(36).toUpperCase();
    setOrderId(newOrderId);
    setOrderPlaced(true);
    clearCart();
  }

  if (orderPlaced) {
    return (
      <div className="page container slide-up" id="checkout-success">
        <div className="checkout-success">
          <div className="success-icon">🎉</div>
          <h1>Order Placed!</h1>
          <p>Thank you for your purchase! Your order has been confirmed.</p>
          <div className="order-id">Order ID: {orderId}</div>
          <p style={{ marginBottom: '32px', fontSize: '0.9rem' }}>
            You will receive a confirmation email shortly.
          </p>
          <Link to="/buyer/browse" className="btn btn-primary btn-lg">
            🏪 Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page container" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>Your cart is empty</h2>
        <p style={{ marginBottom: '24px' }}>Add some items before checking out.</p>
        <Link to="/buyer/browse" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="page container slide-up" id="checkout-page">
      <div className="page-header">
        <h1>📋 Checkout</h1>
        <p>Review your order and confirm your purchase.</p>
      </div>

      <div className="cart-layout">
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '20px' }}>🛒 Order Items ({getCartCount()})</h3>
            {cartItems.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--border-color)',
              }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    by {item.author} × {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent-primary-hover)' }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>📍 Delivery Information</h3>
            {error && (
              <div className="alert alert-error" style={{ marginBottom: '16px', color: 'red' }}>
                ⚠️ {error}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter your full name" 
                id="checkout-name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea 
                className="form-textarea" 
                placeholder="Enter your delivery address" 
                id="checkout-address" 
                style={{ minHeight: '80px' }} 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="Enter your phone number" 
                id="checkout-phone" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="card cart-summary" id="checkout-summary">
          <h3>Payment Summary</h3>
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
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '16px' }}
            onClick={handlePlaceOrder}
            id="place-order-btn"
          >
            ✅ Place Order — ₹{total.toLocaleString()}
          </button>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>
            🔒 Secure checkout • Cash on Delivery
          </p>
        </div>
      </div>
    </div>
  );
}
