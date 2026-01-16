const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const cleanIrrelevantProducts = async () => {
  try {
    console.log('Checking products for irrelevant photos...');

    // Find products with placeholder or irrelevant images
    const irrelevantPatterns = [
      'loremflickr.com',
      'picsum.photos',
      'placeholder',
      'dummyimage.com',
      'via.placeholder.com'
    ];

    let removedCount = 0;

    // Get all products
    const products = await Product.find({});

    for (const product of products) {
      let hasIrrelevantImage = false;

      // Check main image
      if (product.image) {
        hasIrrelevantImage = irrelevantPatterns.some(pattern =>
          product.image.includes(pattern)
        );
      }

      // Check images array
      if (product.images && product.images.length > 0) {
        hasIrrelevantImage = hasIrrelevantImage || product.images.some(img =>
          irrelevantPatterns.some(pattern => img.url.includes(pattern))
        );
      }

      // Remove product if it has irrelevant images
      if (hasIrrelevantImage) {
        await Product.findByIdAndDelete(product._id);
        console.log(`Removed product: ${product.title}`);
        removedCount++;
      }
    }

    console.log(`Cleanup complete! Removed ${removedCount} products with irrelevant photos.`);

    // Show remaining products
    const remainingProducts = await Product.find({});
    console.log(`Remaining products: ${remainingProducts.length}`);

  } catch (error) {
    console.error('Cleanup error:', error);
  } finally {
    process.exit();
  }
};

// Run the cleanup
connectDB().then(() => {
  cleanIrrelevantProducts();
});