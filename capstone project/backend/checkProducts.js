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

const checkProductCount = async () => {
  try {
    const totalProducts = await Product.countDocuments();
    console.log(`Total products in database: ${totalProducts}`);

    // Get category breakdown
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\nProducts by category:');
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} products`);
    });

    // Show a few sample products
    const sampleProducts = await Product.find().limit(5).select('title category price brand');
    console.log('\nSample products:');
    sampleProducts.forEach(product => {
      console.log(`- ${product.title} (${product.category}) - $${product.price} - ${product.brand}`);
    });

  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    process.exit();
  }
};

connectDB().then(() => {
  checkProductCount();
});