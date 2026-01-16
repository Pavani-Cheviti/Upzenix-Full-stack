const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  orderItems: [{
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
      min: [1, 'Quantity must be at least 1']
    },
    selectedVariants: [{
      name: String,
      value: String
    }]
  }],
  shippingAddress: {
    name: {
      type: String,
      required: [true, 'Please add recipient name']
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number']
    },
    address: {
      street: {
        type: String,
        required: [true, 'Please add street address']
      },
      city: {
        type: String,
        required: [true, 'Please add city']
      },
      state: {
        type: String,
        required: [true, 'Please add state']
      },
      zipCode: {
        type: String,
        required: [true, 'Please add zip code']
      },
      country: {
        type: String,
        required: [true, 'Please add country'],
        default: 'USA'
      }
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add payment method'],
    enum: ['card', 'paypal', 'bank-transfer', 'cash-on-delivery']
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  deliveredAt: Date,
  trackingNumber: String,
  notes: String,
  coupon: {
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  }
}, {
  timestamps: true
});

// Create indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

// Virtual for order number
orderSchema.virtual('orderNumber').get(function() {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Pre-save middleware to calculate total price
orderSchema.pre('save', function(next) {
  if (this.isModified('orderItems') || this.isNew) {
    this.totalPrice = this.orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0) + this.shippingPrice + this.taxPrice;

    // Apply coupon discount if exists
    if (this.coupon && this.coupon.discount) {
      if (this.coupon.type === 'percentage') {
        this.totalPrice -= (this.totalPrice * this.coupon.discount / 100);
      } else {
        this.totalPrice -= this.coupon.discount;
      }
    }
  }
  next();
});

// Static method to get orders by user
orderSchema.statics.getByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Instance method to update status
orderSchema.methods.updateStatus = function(status, trackingNumber = null) {
  this.orderStatus = status;
  if (status === 'shipped' && trackingNumber) {
    this.trackingNumber = trackingNumber;
  }
  if (status === 'delivered') {
    this.deliveredAt = new Date();
  }
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);