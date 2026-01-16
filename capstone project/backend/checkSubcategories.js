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

const checkSubcategories = async () => {
  try {
    const totalProducts = await Product.countDocuments();
    console.log(`Total products: ${totalProducts}`);

    // Get subcategory breakdown
    const subcategories = await Product.aggregate([
      { $group: { _id: '$subcategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\nProducts by subcategory:');
    subcategories.forEach(sub => {
      console.log(`${sub._id || 'No subcategory'}: ${sub.count} products`);
    });

    // Check men's and women's products specifically
    const menProducts = await Product.find({ subcategory: 'men' }).limit(5);
    const womenProducts = await Product.find({ subcategory: 'women' }).limit(5);

    console.log('\nMen products:');
    menProducts.forEach(product => {
      console.log(`- ${product.title}`);
    });

    console.log('\nWomen products:');
    womenProducts.forEach(product => {
      console.log(`- ${product.title}`);
    });

  } catch (error) {
    console.error('Error checking subcategories:', error);
  } finally {
    process.exit();
  }
};

connectDB().then(() => {
  checkSubcategories();
});