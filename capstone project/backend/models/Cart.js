const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [99, 'Quantity cannot exceed 99']
  },
  selectedVariants: [{
    name: String,
    value: String
  }],
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  coupon: {
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, {
  timestamps: true
});

// Create indexes
cartSchema.index({ user: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for subtotal
cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// Virtual for total price (including coupon)
cartSchema.virtual('totalPrice').get(function() {
  let total = this.subtotal;
  if (this.coupon && this.coupon.discount) {
    if (this.coupon.type === 'percentage') {
      total -= (total * this.coupon.discount / 100);
    } else {
      total -= this.coupon.discount;
    }
  }
  return Math.max(total, 0); // Ensure total doesn't go negative
});

// Instance method to add item to cart
cartSchema.methods.addItem = function(productId, name, image, price, quantity = 1, selectedVariants = []) {
  const existingItem = this.items.find(item =>
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      name,
      image,
      price,
      quantity,
      selectedVariants
    });
  }

  return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity, selectedVariants = []) {
  const item = this.items.find(item =>
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
  );

  if (item) {
    if (quantity <= 0) {
      this.items = this.items.filter(i => i !== item);
    } else {
      item.quantity = Math.min(quantity, 99); // Max 99 items
    }
  }

  return this.save();
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = function(productId, selectedVariants = []) {
  this.items = this.items.filter(item =>
    !(item.product.toString() === productId.toString() &&
      JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants))
  );

  return this.save();
};

// Instance method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.coupon = undefined;
  return this.save();
};

// Instance method to apply coupon
cartSchema.methods.applyCoupon = function(code, discount, type) {
  this.coupon = { code, discount, type };
  return this.save();
};

// Instance method to remove coupon
cartSchema.methods.removeCoupon = function() {
  this.coupon = undefined;
  return this.save();
};

// Static method to get or create cart for user
cartSchema.statics.getOrCreateCart = async function(userId) {
  let cart = await this.findOne({ user: userId });
  if (!cart) {
    cart = new this({ user: userId });
    await cart.save();
  }
  return cart;
};

module.exports = mongoose.model('Cart', cartSchema);