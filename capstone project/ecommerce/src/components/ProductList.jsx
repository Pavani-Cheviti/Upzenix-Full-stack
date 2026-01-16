import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { productsAPI } from '../services/api';

const ProductList = ({ searchParams }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced filter states - initialize from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(0);

  // Helper functions to map FakeStore categories to our Amazon-like categories
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getProducts(searchParams);
        setProducts(response.data);

        // Get categories
        const categoriesResponse = await productsAPI.getCategories();
        const categoryMap = {};
        categoriesResponse.data.forEach(cat => {
          categoryMap[cat] = cat.charAt(0).toUpperCase() + cat.slice(1);
        });
        setCategories(categoryMap);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Filter by style
    if (selectedStyle) {
      filtered = filtered.filter(product => product.style === selectedStyle);
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter(product => product.rating.rate >= selectedRating);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating.rate - a.rating.rate;
        case 'popularity':
          return b.popularity - a.popularity;
        case 'name':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedSubcategory, selectedStyle, sortBy, priceRange, selectedRating]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-6">
      {/* Search and Sort Bar */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Filters
            </h3>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                Category
              </h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                    All Categories
                  </span>
                </label>
                {Object.entries(categories).map(([categoryKey, categoryName]) => (
                  <label key={categoryKey} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={categoryKey}
                      checked={selectedCategory === categoryKey}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                      {categoryName}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                Price Range
              </h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="input-field text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="input-field text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                Customer Rating
              </h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={selectedRating === rating}
                      onChange={(e) => setSelectedRating(Number(e.target.value))}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                      {rating}+ Stars
                    </span>
                  </label>
                ))}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="rating"
                    value={0}
                    checked={selectedRating === 0}
                    onChange={(e) => setSelectedRating(0)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                    All Ratings
                  </span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedSubcategory('');
                setSelectedStyle('');
                setSelectedRating(0);
                setPriceRange([0, 1000]);
                setSearchTerm('');
              }}
              className="w-full btn-secondary text-sm"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Results count */}
          <div className="mb-6 text-neutral-600 dark:text-neutral-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {error}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Please try again later or check your internet connection.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                No products found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
