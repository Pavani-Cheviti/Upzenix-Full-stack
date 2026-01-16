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

const checkCurrentProducts = async () => {
  try {
    console.log('Checking current products by category...\n');

    const products = await Product.find({});

    // Group products by category
    const categories = {};

    products.forEach(product => {
      const category = product.category || 'uncategorized';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(product);
    });

    console.log('Current product distribution:');
    Object.keys(categories).forEach(category => {
      console.log(`${category}: ${categories[category].length} products`);
    });

    console.log(`\nTotal products: ${products.length}`);

  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    process.exit();
  }
};

connectDB().then(() => {
  checkCurrentProducts();
});