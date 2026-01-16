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

const checkExactCategories = async () => {
  try {
    console.log('Checking exact category names...\n');

    const products = await Product.find({});

    // Get unique categories
    const uniqueCategories = [...new Set(products.map(p => p.category))];

    console.log('Unique categories found:');
    uniqueCategories.forEach(category => {
      console.log(`- "${category}"`);
    });

    console.log('\nDetailed breakdown:');
    uniqueCategories.forEach(category => {
      const count = products.filter(p => p.category === category).length;
      console.log(`${category}: ${count} products`);
    });

    // Check for men's and women's clothing specifically
    const mensClothing = products.filter(p =>
      p.category && p.category.toLowerCase().includes('men')
    );
    const womensClothing = products.filter(p =>
      p.category && p.category.toLowerCase().includes('women')
    );

    console.log(`\nMen's clothing products: ${mensClothing.length}`);
    console.log(`Women's clothing products: ${womensClothing.length}`);

    console.log(`\nTotal products: ${products.length}`);

  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    process.exit();
  }
};

connectDB().then(() => {
  checkExactCategories();
});