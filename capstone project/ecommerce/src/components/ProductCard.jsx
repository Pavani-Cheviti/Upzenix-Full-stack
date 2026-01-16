import { Link } from 'react-router-dom';
import { Star, Truck, ShoppingCart } from 'lucide-react';
import { useMemo } from 'react';
import useCartStore from '../stores/cartStore';

const ProductCard = ({ product }) => {
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  // Format price in Indian Rupees
  const formatINR = (amount) => {
    const num = Math.round(amount * 83);
    return num.toLocaleString('en-IN');
  };

  // Format price in USD
  const formatUSD = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  // Mock delivery date - in real app this would come from API
  const deliveryInfo = useMemo(() => {
    const randomDays = 3; // Fixed for demo
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + randomDays);
    const deliveryDay = deliveryDate.toLocaleDateString('en-US', { weekday: 'long' });
    const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { deliveryDay, deliveryDateStr };
  }, []);

  return (
    <div className="card group overflow-hidden animate-fade-in hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-neutral-50 dark:bg-neutral-800">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg capitalize">
              {product.category}
            </span>
          </div>
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2 leading-tight">
            {product.title}
          </h3>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(product.rating.rate)
                      ? 'text-yellow-400 fill-current'
                      : 'text-neutral-300 dark:text-neutral-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 ml-2">
              ({product.rating.count})
            </span>
          </div>
          <div className="flex items-center text-xs text-neutral-600 dark:text-neutral-400 mb-3">
            <Truck size={12} className="mr-1" />
            <span>Get it by {deliveryInfo.deliveryDay}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {formatINR(product.price)}
              </span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {formatUSD(product.price)}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;