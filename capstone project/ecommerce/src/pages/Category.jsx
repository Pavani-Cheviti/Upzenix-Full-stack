import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { categories, getSubcategories } from '../data/categories';
import { mockProducts } from '../data/mockProducts';

const Category = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(0);

  // Helper functions (same as in ProductList)
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
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        // Filter products by our category mapping
        const categoryProducts = response.data.filter(product => {
          const mappedCategory = mapToOurCategories(product.category);
          return mappedCategory === categoryId;
        }).map(product => ({
          ...product,
          category: mapToOurCategories(product.category),
          subcategory: getSubcategory(product.category, product.title),
          style: getStyle(product.category, product.title),
          popularity: Math.floor(Math.random() * 1000) + 100
        }));

        // Add mock products for this category
        const mockCategoryProducts = mockProducts.filter(product => product.category === categoryId);

        setProducts([...categoryProducts, ...mockCategoryProducts]);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
  }, [products, searchTerm, selectedSubcategory, selectedStyle, sortBy, priceRange, selectedRating]);

  const categoryInfo = categories[categoryId];
  const subcategories = categoryInfo ? getSubcategories(categoryId) : {};

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
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {categoryInfo?.name || 'Category'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover amazing {categoryInfo?.name.toLowerCase()} at great prices
        </p>
      </div>

      {/* Subcategory Navigation */}
      {Object.keys(subcategories).length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubcategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSubcategory === ''
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All {categoryInfo?.name}
            </button>
            {Object.keys(subcategories).map(subKey => (
              <button
                key={subKey}
                onClick={() => setSelectedSubcategory(subKey)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSubcategory === subKey
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {subcategories[subKey].name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={categoryId}
        setSelectedCategory={() => {}} // Read-only for category page
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        sortBy={sortBy}
        setSortBy={setSortBy}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        categories={[]}
      />

      {/* Results count */}
      <div className="mb-4 text-gray-600 dark:text-gray-400">
        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          No products found in this category.
          <br />
          Try adjusting your filters or browse other categories.
        </div>
      )}
    </div>
  );
};

export default Category;