import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts, CATEGORIES } from '../../context/ProductContext';

export default function AddProduct() {
  const { currentUser } = useAuth();
  const { addProduct } = useProducts();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category: 'Computer Science',
    image: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.author.trim() || !form.price) {
      setError('Please fill in the title, author, and price.');
      return;
    }

    if (Number(form.price) <= 0) {
      setError('Price must be greater than 0.');
      return;
    }

    addProduct({
      title: form.title.trim(),
      author: form.author.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      image: form.image.trim(),
      sellerId: currentUser.id,
      sellerName: currentUser.name,
    });

    setSuccess('Product added successfully! 🎉');
    setForm({
      title: '',
      author: '',
      description: '',
      price: '',
      category: 'Computer Science',
      image: '',
    });

    setTimeout(() => {
      navigate('/seller/my-products');
    }, 1500);
  }

  return (
    <div className="page container slide-up" id="add-product-page">
      <div className="page-header">
        <h1>➕ Add New Product</h1>
        <p>List a new book or study material for sale.</p>
      </div>

      <div className="card product-form">
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        <form onSubmit={handleSubmit} id="add-product-form">
          <div className="form-group">
            <label className="form-label" htmlFor="prod-title">Book Title *</label>
            <input
              type="text"
              id="prod-title"
              name="title"
              className="form-input"
              placeholder="e.g. Introduction to Algorithms"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prod-author">Author *</label>
            <input
              type="text"
              id="prod-author"
              name="author"
              className="form-input"
              placeholder="e.g. Thomas H. Cormen"
              value={form.author}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="prod-price">Price (₹) *</label>
              <input
                type="number"
                id="prod-price"
                name="price"
                className="form-input"
                placeholder="e.g. 499"
                value={form.price}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-category">Category</label>
              <select
                id="prod-category"
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prod-desc">Description</label>
            <textarea
              id="prod-desc"
              name="description"
              className="form-textarea"
              placeholder="Describe the book, its condition, edition, etc."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prod-image">Image URL (optional)</label>
            <input
              type="url"
              id="prod-image"
              name="image"
              className="form-input"
              placeholder="https://example.com/book-cover.jpg"
              value={form.image}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" id="add-product-submit">
              📦 Add Product
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/seller/my-products')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
