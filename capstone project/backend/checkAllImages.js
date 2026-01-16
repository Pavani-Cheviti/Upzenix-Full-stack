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

const checkAllProductImages = async () => {
  try {
    console.log('Checking all product images...');

    const products = await Product.find({});

    console.log(`Total products: ${products.length}\n`);

    const imageSources = new Map();

    products.forEach((product) => {
      // Check main image
      if (product.image) {
        const domain = new URL(product.image).hostname;
        imageSources.set(domain, (imageSources.get(domain) || 0) + 1);
      }

      // Check additional images
      if (product.images && product.images.length > 0) {
        product.images.forEach((img) => {
          const domain = new URL(img.url).hostname;
          imageSources.set(domain, (imageSources.get(domain) || 0) + 1);
        });
      }
    });

    console.log('Image sources:');
    imageSources.forEach((count, domain) => {
      console.log(`${domain}: ${count} images`);
    });

    // Check for any products with potentially problematic images
    const potentiallyIrrelevant = products.filter(product => {
      const imageUrl = product.image || '';
      return imageUrl.includes('placeholder') ||
             imageUrl.includes('lorem') ||
             imageUrl.includes('dummy') ||
             imageUrl.includes('picsum') ||
             imageUrl.includes('via.placeholder');
    });

    if (potentiallyIrrelevant.length > 0) {
      console.log(`\nFound ${potentiallyIrrelevant.length} products with potentially irrelevant images:`);
      potentiallyIrrelevant.forEach(product => {
        console.log(`- ${product.title}: ${product.image}`);
      });
    } else {
      console.log('\nNo products found with irrelevant/placeholder images.');
    }

  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    process.exit();
  }
};

connectDB().then(() => {
  checkAllProductImages();
});