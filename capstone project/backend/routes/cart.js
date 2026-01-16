const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      // Return empty cart if none exists
      return res.json({
        success: true,
        data: {
          items: [],
          totalItems: 0,
          subtotal: 0,
          totalPrice: 0
        }
      });
    }

    res.json({
      success: true,
      data: {
        ...cart.toObject(),
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        totalPrice: cart.totalPrice
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').optional().isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, quantity = 1, selectedVariants = [] } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check inventory
    if (product.inventory.trackInventory && product.inventory.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient inventory'
      });
    }

    // Get or create cart
    const cart = await Cart.getOrCreateCart(req.user.id);

    // Add item to cart
    await cart.addItem(productId, product.title, product.image, product.price, quantity, selectedVariants);

    // Populate product details
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        ...cart.toObject(),
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        totalPrice: cart.totalPrice
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
router.put('/:productId', [
  body('quantity').isInt({ min: 0, max: 99 }).withMessage('Quantity must be between 0 and 99'),
  body('selectedVariants').optional().isArray()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { quantity, selectedVariants = [] } = req.body;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // If quantity is 0, remove item
    if (quantity === 0) {
      await cart.removeItem(productId, selectedVariants);
    } else {
      // Check inventory if increasing quantity
      const existingItem = cart.items.find(item =>
        item.product.toString() === productId &&
        JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
      );

      if (existingItem && quantity > existingItem.quantity) {
        const product = await Product.findById(productId);
        if (product && product.inventory.trackInventory) {
          const additionalQuantity = quantity - existingItem.quantity;
          if (product.inventory.quantity < additionalQuantity) {
            return res.status(400).json({
              success: false,
              message: 'Insufficient inventory'
            });
          }
        }
      }

      await cart.updateItemQuantity(productId, quantity, selectedVariants);
    }

    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: {
        ...cart.toObject(),
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        totalPrice: cart.totalPrice
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', [
  body('selectedVariants').optional().isArray()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { selectedVariants = [] } = req.body;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.removeItem(productId, selectedVariants);
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        ...cart.toObject(),
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        totalPrice: cart.totalPrice
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        items: [],
        totalItems: 0,
        subtotal: 0,
        totalPrice: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
router.post('/coupon', [
  body('code').notEmpty().withMessage('Coupon code is required').trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { code } = req.body;

    // For now, implement a simple coupon system
    // In a real app, you'd have a Coupon model
    const coupons = {
      'SAVE10': { discount: 10, type: 'percentage' },
      'SAVE50': { discount: 50, type: 'fixed' }
    };

    const coupon = coupons[code.toUpperCase()];
    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.applyCoupon(code.toUpperCase(), coupon.discount, coupon.type);
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        ...cart.toObject(),
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        totalPrice: cart.totalPrice
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
router.delete('/coupon', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.removeCoupon();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Coupon removed successfully',
      data: {
        ...cart.toObject(),
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        totalPrice: cart.totalPrice
      }
    });
  } catch (error) {
    console.error('Remove coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;