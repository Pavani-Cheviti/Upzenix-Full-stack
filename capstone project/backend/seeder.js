const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shophub');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Existing data cleared');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shophub.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin user created');

    // Fetch products from FakeStore API
    console.log('Fetching products from FakeStore API...');
    const response = await axios.get('https://fakestoreapi.com/products');
    const fakeStoreProducts = response.data;

    // Transform and create products
    const products = fakeStoreProducts.map(product => ({
      title: product.title,
      description: product.description,
      price: product.price,
      category: mapToOurCategories(product.category),
      subcategory: getSubcategory(product.category, product.title),
      style: getStyle(product.category, product.title),
      image: product.image,
      images: [{
        url: product.image,
        alt: product.title
      }],
      inventory: {
        quantity: Math.floor(Math.random() * 50) + 10, // Random quantity 10-60
        sku: `SKU-${product.id.toString().padStart(4, '0')}`,
        trackInventory: true
      },
      rating: {
        rate: product.rating.rate,
        count: product.rating.count
      },
      brand: getBrandFromTitle(product.title),
      isActive: true,
      isFeatured: Math.random() > 0.8 // 20% chance of being featured
    }));

    // Generate additional products by creating variations
    const additionalProducts = generateAdditionalProducts(fakeStoreProducts);
    const allProducts = [...products, ...additionalProducts];

    await Product.insertMany(allProducts);
    console.log(`${allProducts.length} products imported successfully (${products.length} from API + ${additionalProducts.length} generated)`);

    console.log('Data Import Success!');
    process.exit();
  } catch (error) {
    console.error('Data Import Error:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error('Data Destroy Error:', error);
    process.exit(1);
  }
};

// Generate additional products by creating variations of existing ones
const generateAdditionalProducts = (fakeStoreProducts) => {
  const additionalProducts = [];

  // First, add specific men's and women's products
  const menProducts = [
    {
      title: "Men's Formal Dress Shirt",
      description: "Classic white formal dress shirt perfect for business meetings and special occasions. Made from premium cotton with a comfortable fit.",
      price: 45.99,
      category: 'clothing',
      subcategory: 'men',
      style: 'Formal',
      image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png', // Using existing image
      images: [{ url: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png', alt: "Men's Formal Dress Shirt" }],
      inventory: { quantity: 25, sku: 'SKU-MEN-001', trackInventory: true },
      rating: { rate: 4.2, count: 89 },
      brand: 'Ralph Lauren'
    },
    {
      title: "Men's Casual Denim Jeans",
      description: "Comfortable slim-fit denim jeans with a modern cut. Perfect for everyday wear and casual outings.",
      price: 79.99,
      category: 'clothing',
      subcategory: 'men',
      style: 'Casual',
      image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png', alt: "Men's Casual Denim Jeans" }],
      inventory: { quantity: 30, sku: 'SKU-MEN-002', trackInventory: true },
      rating: { rate: 4.5, count: 156 },
      brand: 'Levi\'s'
    },
    {
      title: "Men's Sports Running Shoes",
      description: "Lightweight running shoes with advanced cushioning technology. Ideal for jogging, gym workouts, and daily activities.",
      price: 129.99,
      category: 'clothing',
      subcategory: 'men',
      style: 'Sport',
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png', alt: "Men's Sports Running Shoes" }],
      inventory: { quantity: 20, sku: 'SKU-MEN-003', trackInventory: true },
      rating: { rate: 4.7, count: 203 },
      brand: 'Nike'
    },
    {
      title: "Men's Leather Wallet",
      description: "Genuine leather wallet with multiple card slots and compartments. Sleek design perfect for professional use.",
      price: 34.99,
      category: 'clothing',
      subcategory: 'men',
      style: 'Accessory',
      image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png', alt: "Men's Leather Wallet" }],
      inventory: { quantity: 40, sku: 'SKU-MEN-004', trackInventory: true },
      rating: { rate: 4.4, count: 167 },
      brand: 'Gucci'
    },
    {
      title: "Men's Winter Jacket",
      description: "Warm insulated winter jacket with waterproof coating. Perfect for cold weather and outdoor activities.",
      price: 149.99,
      category: 'clothing',
      subcategory: 'men',
      style: 'Winter Wear',
      image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png', alt: "Men's Winter Jacket" }],
      inventory: { quantity: 22, sku: 'SKU-MEN-005', trackInventory: true },
      rating: { rate: 4.6, count: 134 },
      brand: 'North Face'
    },
    {
      title: "Men's Polo Shirt",
      description: "Classic cotton polo shirt with collar and short sleeves. Versatile for casual and semi-formal occasions.",
      price: 29.99,
      category: 'clothing',
      subcategory: 'men',
      style: 'Casual',
      image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879._SX._UX._SY._UY_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879._SX._UX._SY._UY_t.png', alt: "Men's Polo Shirt" }],
      inventory: { quantity: 35, sku: 'SKU-MEN-006', trackInventory: true },
      rating: { rate: 4.1, count: 98 },
      brand: 'Lacoste'
    },
    {
      title: "Men's Cargo Pants",
      description: "Durable cargo pants with multiple pockets. Perfect for outdoor activities and casual wear.",
      price: 69.99,
      category: 'clothing',
      subcategory: 'men',
      style: 'Casual',
      image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png', alt: "Men's Cargo Pants" }],
      inventory: { quantity: 28, sku: 'SKU-MEN-007', trackInventory: true },
      rating: { rate: 4.3, count: 112 },
      brand: 'Columbia'
    },
    {
      title: "Men's Hooded Sweatshirt",
      description: "Comfortable cotton sweatshirt with hood and kangaroo pocket. Ideal for layering and casual wear.",
      price: 54.99,
      category: 'clothing',
      subcategory: 'men',
      style: 'Casual',
      image: 'https://fakestoreapi.com/img/51UDEzMJVwL._AC_UL640_QL65_ML3_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/51UDEzMJVwL._AC_UL640_QL65_ML3_t.png', alt: "Men's Hooded Sweatshirt" }],
      inventory: { quantity: 32, sku: 'SKU-MEN-008', trackInventory: true },
      rating: { rate: 4.5, count: 145 },
      brand: 'Adidas'
    }
  ];

  const womenProducts = [
    {
      title: "Women's Elegant Evening Dress",
      description: "Stunning floor-length evening dress with intricate detailing. Perfect for formal events, weddings, and special occasions.",
      price: 189.99,
      category: 'clothing',
      subcategory: 'women',
      style: 'Party Wear',
      image: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png', alt: "Women's Elegant Evening Dress" }],
      inventory: { quantity: 15, sku: 'SKU-WOMEN-001', trackInventory: true },
      rating: { rate: 4.8, count: 127 },
      brand: 'Chanel'
    },
    {
      title: "Women's Casual Summer Blouse",
      description: "Light and breezy summer blouse made from breathable fabric. Features a flattering fit and elegant design.",
      price: 34.99,
      category: 'clothing',
      subcategory: 'women',
      style: 'Western',
      image: 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png', alt: "Women's Casual Summer Blouse" }],
      inventory: { quantity: 35, sku: 'SKU-WOMEN-002', trackInventory: true },
      rating: { rate: 4.3, count: 94 },
      brand: 'Zara'
    },
    {
      title: "Women's Designer Handbag",
      description: "Luxurious leather handbag with gold accents. Spacious interior perfect for daily essentials and special occasions.",
      price: 299.99,
      category: 'clothing',
      subcategory: 'women',
      style: 'Luxury',
      image: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png', alt: "Women's Designer Handbag" }],
      inventory: { quantity: 12, sku: 'SKU-WOMEN-003', trackInventory: true },
      rating: { rate: 4.9, count: 78 },
      brand: 'Gucci'
    },
    {
      title: "Women's Winter Coat",
      description: "Warm and stylish wool coat perfect for cold weather. Features a classic design with modern tailoring.",
      price: 159.99,
      category: 'clothing',
      subcategory: 'women',
      style: 'Winter Wear',
      image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png', alt: "Women's Winter Coat" }],
      inventory: { quantity: 18, sku: 'SKU-WOMEN-004', trackInventory: true },
      rating: { rate: 4.6, count: 145 },
      brand: 'Burberry'
    },
    {
      title: "Women's Yoga Leggings",
      description: "High-performance yoga leggings made from moisture-wicking fabric. Perfect for workouts and casual wear.",
      price: 49.99,
      category: 'clothing',
      subcategory: 'women',
      style: 'Sport',
      image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png', alt: "Women's Yoga Leggings" }],
      inventory: { quantity: 25, sku: 'SKU-WOMEN-005', trackInventory: true },
      rating: { rate: 4.4, count: 89 },
      brand: 'Lululemon'
    },
    {
      title: "Women's Maxi Skirt",
      description: "Flowing maxi skirt with elegant pleats. Perfect for casual outings and semi-formal occasions.",
      price: 59.99,
      category: 'clothing',
      subcategory: 'women',
      style: 'Western',
      image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png', alt: "Women's Maxi Skirt" }],
      inventory: { quantity: 22, sku: 'SKU-WOMEN-006', trackInventory: true },
      rating: { rate: 4.2, count: 76 },
      brand: 'H&M'
    },
    {
      title: "Women's Cardigan Sweater",
      description: "Soft knit cardigan sweater with button closure. Versatile layering piece for any season.",
      price: 79.99,
      category: 'clothing',
      subcategory: 'women',
      style: 'Casual',
      image: 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png', alt: "Women's Cardigan Sweater" }],
      inventory: { quantity: 28, sku: 'SKU-WOMEN-007', trackInventory: true },
      rating: { rate: 4.5, count: 103 },
      brand: 'Gap'
    },
    {
      title: "Women's High Heels",
      description: "Elegant stiletto heels with comfortable padding. Perfect for formal events and special occasions.",
      price: 119.99,
      category: 'clothing',
      subcategory: 'women',
      style: 'Party Wear',
      image: 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2_t.png',
      images: [{ url: 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2_t.png', alt: "Women's High Heels" }],
      inventory: { quantity: 20, sku: 'SKU-WOMEN-008', trackInventory: true },
      rating: { rate: 4.3, count: 92 },
      brand: 'Jimmy Choo'
    }
  ];

  // Add men's and women's products with variations
  menProducts.forEach((product, index) => {
    // Add the base product
    additionalProducts.push(product);

    // Add 2-3 variations for each men's product
    const variations = ['Premium', 'Deluxe', 'Pro'];
    variations.forEach((variation, varIndex) => {
      const fullTitle = `${product.title} ${variation}`;
      const truncatedTitle = fullTitle.length > 100 ? fullTitle.substring(0, 97) + '...' : fullTitle;

      additionalProducts.push({
        title: truncatedTitle,
        description: `${product.description} ${variation} version with enhanced features.`,
        price: Math.round((product.price * (1 + varIndex * 0.3)) * 100) / 100,
        category: product.category,
        subcategory: product.subcategory,
        style: product.style,
        image: product.image,
        images: [{ url: product.image, alt: truncatedTitle }],
        inventory: {
          quantity: Math.floor(Math.random() * 20) + 10,
          sku: `SKU-MEN-VAR-${index}-${varIndex}`,
          trackInventory: true
        },
        rating: {
          rate: Math.min(5, Math.max(4.0, product.rating.rate - 0.2 + Math.random() * 0.4)),
          count: Math.floor(product.rating.count * (0.8 + Math.random() * 0.4))
        },
        brand: product.brand,
        isActive: true,
        isFeatured: Math.random() > 0.85
      });
    });
  });

  womenProducts.forEach((product, index) => {
    // Add the base product
    additionalProducts.push(product);

    // Add 2-3 variations for each women's product
    const variations = ['Premium', 'Deluxe', 'Pro'];
    variations.forEach((variation, varIndex) => {
      const fullTitle = `${product.title} ${variation}`;
      const truncatedTitle = fullTitle.length > 100 ? fullTitle.substring(0, 97) + '...' : fullTitle;

      additionalProducts.push({
        title: truncatedTitle,
        description: `${product.description} ${variation} version with enhanced features.`,
        price: Math.round((product.price * (1 + varIndex * 0.3)) * 100) / 100,
        category: product.category,
        subcategory: product.subcategory,
        style: product.style,
        image: product.image,
        images: [{ url: product.image, alt: truncatedTitle }],
        inventory: {
          quantity: Math.floor(Math.random() * 20) + 10,
          sku: `SKU-WOMEN-VAR-${index}-${varIndex}`,
          trackInventory: true
        },
        rating: {
          rate: Math.min(5, Math.max(4.0, product.rating.rate - 0.2 + Math.random() * 0.4)),
          count: Math.floor(product.rating.count * (0.8 + Math.random() * 0.4))
        },
        brand: product.brand,
        isActive: true,
        isFeatured: Math.random() > 0.85
      });
    });
  });

  const variations = [
    { suffix: 'Premium', priceMultiplier: 1.5, descriptionAdd: ' Premium quality with enhanced features.' },
    { suffix: 'Deluxe', priceMultiplier: 2.0, descriptionAdd: ' Deluxe edition with premium materials and superior craftsmanship.' },
    { suffix: 'Basic', priceMultiplier: 0.7, descriptionAdd: ' Essential version perfect for everyday use.' },
    { suffix: 'Pro', priceMultiplier: 1.8, descriptionAdd: ' Professional grade with advanced specifications.' },
    { suffix: 'Lite', priceMultiplier: 0.6, descriptionAdd: ' Lightweight and compact version for portability.' },
    { suffix: 'XL', priceMultiplier: 1.3, descriptionAdd: ' Extra large size for maximum comfort and coverage.' },
    { suffix: 'Mini', priceMultiplier: 0.8, descriptionAdd: ' Compact size ideal for travel and convenience.' },
    { suffix: 'Eco', priceMultiplier: 1.1, descriptionAdd: ' Environmentally friendly version made with sustainable materials.' },
    { suffix: 'Sport', priceMultiplier: 1.2, descriptionAdd: ' Designed for active lifestyles and outdoor activities.' },
    { suffix: 'Classic', priceMultiplier: 1.4, descriptionAdd: ' Timeless design that never goes out of style.' }
  ];

  fakeStoreProducts.forEach((product, index) => {
    // Create 2-3 variations for each product
    const numVariations = Math.floor(Math.random() * 2) + 2; // 2-3 variations

    for (let i = 0; i < numVariations; i++) {
      const variation = variations[(index * numVariations + i) % variations.length];
      const fullTitle = `${product.title} ${variation.suffix}`;
      const truncatedTitle = fullTitle.length > 100 ? fullTitle.substring(0, 97) + '...' : fullTitle;
      const newProduct = {
        title: truncatedTitle,
        description: product.description + variation.descriptionAdd,
        price: Math.round((product.price * variation.priceMultiplier) * 100) / 100,
        category: mapToOurCategories(product.category),
        subcategory: getSubcategory(product.category, product.title),
        style: getStyle(product.category, product.title),
        image: product.image, // Keep same image for variations of same product
        images: [{
          url: product.image,
          alt: truncatedTitle
        }],
        inventory: {
          quantity: Math.floor(Math.random() * 30) + 5, // Random quantity 5-35
          sku: `SKU-VAR-${(index * 10 + i + 21).toString().padStart(4, '0')}`, // Start from 0021
          trackInventory: true
        },
        rating: {
          rate: Math.min(5, Math.max(3.5, product.rating.rate - 0.5 + Math.random())), // Keep rating between 3.5-5
          count: Math.floor(product.rating.count * (0.5 + Math.random())) // Varied count
        },
        brand: getBrandFromTitle(product.title),
        isActive: true,
        isFeatured: Math.random() > 0.9 // 10% chance of being featured
      };
      additionalProducts.push(newProduct);
    }
  });

  return additionalProducts;
};

// Helper functions to map FakeStore categories to our categories
const mapToOurCategories = (fakestoreCategory) => {
  const categoryMap = {
    "men's clothing": 'clothing',
    "women's clothing": 'clothing',
    'jewelery': 'jewellery',
    'electronics': 'electronics'
  };
  return categoryMap[fakestoreCategory] || fakestoreCategory;
};

const getSubcategory = (fakestoreCategory, title) => {
  const titleLower = title.toLowerCase();
  if (fakestoreCategory === "men's clothing") {
    if (titleLower.includes('shirt') || titleLower.includes('t-shirt')) return 'men';
    if (titleLower.includes('jacket') || titleLower.includes('coat')) return 'men';
  }
  if (fakestoreCategory === "women's clothing") {
    if (titleLower.includes('dress') || titleLower.includes('top')) return 'women';
  }
  if (fakestoreCategory === 'jewelery') return 'gold';
  if (fakestoreCategory === 'electronics') {
    if (titleLower.includes('laptop')) return 'laptops';
    if (titleLower.includes('phone') || titleLower.includes('smartphone')) return 'mobiles';
    if (titleLower.includes('headphone')) return 'headphones';
  }
  return '';
};

const getStyle = (fakestoreCategory, title) => {
  const titleLower = title.toLowerCase();
  if (fakestoreCategory === "men's clothing") {
    if (titleLower.includes('casual') || titleLower.includes('t-shirt')) return 'Casual';
    if (titleLower.includes('formal') || titleLower.includes('shirt')) return 'Formal';
  }
  if (fakestoreCategory === "women's clothing") {
    if (titleLower.includes('dress')) return 'Party Wear';
    if (titleLower.includes('top') || titleLower.includes('blouse')) return 'Western';
  }
  return '';
};

const getBrandFromTitle = (title) => {
  const brands = ['Nike', 'Adidas', 'Puma', 'Samsung', 'Apple', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo'];
  return brands[Math.floor(Math.random() * brands.length)];
};

// Run the script
if (process.argv[2] === '-d') {
  destroyData();
} else {
  connectDB().then(() => {
    importData();
  });
}