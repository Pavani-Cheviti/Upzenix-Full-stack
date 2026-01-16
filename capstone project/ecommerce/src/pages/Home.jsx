import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Star } from 'lucide-react';
import ProductList from '../components/ProductList';

const Home = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 lg:px-6 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Welcome to ShopHub
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Discover amazing products at great prices. Shop with confidence and enjoy fast, free delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Truck size={20} />
                <span className="font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Shield size={20} />
                <span className="font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Star size={20} />
                <span className="font-medium">Best Prices</span>
              </div>
            </div>
            <Link to="#products" className="btn-primary inline-flex items-center gap-2">
              <ShoppingBag size={20} />
              Start Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Shop by Category
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Clothing', icon: '👕', link: '/category/clothing', color: 'bg-blue-500' },
              { name: 'Electronics', icon: '📱', link: '/category/electronics', color: 'bg-green-500' },
              { name: 'Jewellery', icon: '💍', link: '/category/jewellery', color: 'bg-purple-500' },
              { name: 'Home & Kitchen', icon: '🏠', link: '/category/home-kitchen', color: 'bg-orange-500' },
              { name: 'Footwear', icon: '👟', link: '/category/footwear', color: 'bg-pink-500' },
              { name: 'Beauty', icon: '💄', link: '/category/beauty', color: 'bg-red-500' }
            ].map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="card p-6 text-center group hover:scale-105 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Featured Products
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Browse our latest collection of amazing products
            </p>
          </div>
          <ProductList searchParams={searchParams} />
        </div>
      </section>
    </div>
  );
};

export default Home;