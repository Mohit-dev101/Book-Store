import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// ─── STATS ────────────────────────────────────────────────────────────────────
// @route   GET /api/admin/stats
// @desc    Get overall platform statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalProducts, buyers, sellers] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'buyer' }),
      User.countDocuments({ role: 'seller' }),
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: { totalUsers, totalProducts, buyers, sellers },
      recentUsers,
      recentProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── USERS ────────────────────────────────────────────────────────────────────
// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Change a user's role
router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['buyer', 'seller', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid role' });
  }
  // Prevent admin from demoting themselves
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, error: 'Cannot change your own role' });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, error: 'Cannot delete yourself' });
  }
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // Also remove their products
    await Product.deleteMany({ sellerId: req.params.id });
    res.json({ success: true, message: 'User and their products deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
// @route   GET /api/admin/products
// @desc    Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete any product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
