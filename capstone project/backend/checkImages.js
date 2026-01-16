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

const checkProductImages = async () => {
  try {
    console.log('Checking product images...');

    const products = await Product.find({}).limit(5); // Check first 5 products

    products.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}: ${product.title}`);
      console.log(`Main image: ${product.image}`);

      if (product.images && product.images.length > 0) {
        console.log('Additional images:');
        product.images.forEach((img, imgIndex) => {
          console.log(`  ${imgIndex + 1}: ${img.url}`);
        });
      }
    });

  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    process.exit();
  }
};

connectDB().then(() => {
  checkProductImages();
});