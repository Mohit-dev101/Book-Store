import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Map cart to flatten out product details
    const cartItems = user.cart.map(item => ({
      ...item.productId._doc,
      quantity: item.quantity,
      id: item.productId._id,
      cartItemId: item._id
    }));
    
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', protect, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const existingItem = user.cart.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }
    
    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/:productId', protect, async (req, res) => {
  const { quantity } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const item = user.cart.find(item => item.productId.toString() === req.params.productId);
    
    if (item) {
      if (quantity <= 0) {
        user.cart = user.cart.filter(i => i.productId.toString() !== req.params.productId);
      } else {
        item.quantity = quantity;
      }
      await user.save();
      res.json(user.cart);
    } else {
      res.status(404).json({ error: 'Item not in cart' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.productId.toString() !== req.params.productId);
    
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
