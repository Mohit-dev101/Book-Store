import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect, sellerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Seller
router.post('/', protect, sellerOnly, async (req, res) => {
  try {
    const seller = await User.findById(req.user.id);
    const product = new Product({
      ...req.body,
      sellerId: req.user.id,
      sellerName: seller.name
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Seller
router.put('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Seller
router.delete('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
