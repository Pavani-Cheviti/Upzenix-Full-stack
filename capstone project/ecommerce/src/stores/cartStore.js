import { create } from 'zustand';
import { cartAPI } from '../services/api';

const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,
  error: null,

  // Fetch cart from backend
  fetchCart: async () => {
    try {
      set({ loading: true, error: null });
      const response = await cartAPI.getCart();
      set({
        cart: response.data.data.items || [],
        loading: false
      });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      set({
        error: error.response?.data?.message || 'Failed to fetch cart',
        loading: false
      });
    }
  },

  // Add item to cart
  addToCart: async (product, quantity = 1) => {
    try {
      set({ loading: true, error: null });
      const response = await cartAPI.addToCart({
        productId: product._id || product.id,
        quantity,
        selectedVariants: []
      });

      set({
        cart: response.data.data.items || [],
        loading: false
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      set({
        error: error.response?.data?.message || 'Failed to add item to cart',
        loading: false
      });
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      set({ loading: true, error: null });
      const response = await cartAPI.removeFromCart(productId, { selectedVariants: [] });

      set({
        cart: response.data.data.items || [],
        loading: false
      });
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      set({
        error: error.response?.data?.message || 'Failed to remove item from cart',
        loading: false
      });
    }
  },

  // Update item quantity
  updateQuantity: async (productId, quantity) => {
    try {
      set({ loading: true, error: null });

      if (quantity <= 0) {
        await get().removeFromCart(productId);
        return;
      }

      const response = await cartAPI.updateCartItem(productId, {
        quantity,
        selectedVariants: []
      });

      set({
        cart: response.data.data.items || [],
        loading: false
      });
    } catch (error) {
      console.error('Failed to update quantity:', error);
      set({
        error: error.response?.data?.message || 'Failed to update quantity',
        loading: false
      });
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      set({ loading: true, error: null });
      await cartAPI.clearCart();

      set({
        cart: [],
        loading: false
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      set({
        error: error.response?.data?.message || 'Failed to clear cart',
        loading: false
      });
    }
  },

  // Apply coupon
  applyCoupon: async (code) => {
    try {
      set({ loading: true, error: null });
      const response = await cartAPI.applyCoupon({ code });

      set({
        cart: response.data.data.items || [],
        loading: false
      });
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      set({
        error: error.response?.data?.message || 'Failed to apply coupon',
        loading: false
      });
    }
  },

  // Remove coupon
  removeCoupon: async () => {
    try {
      set({ loading: true, error: null });
      const response = await cartAPI.removeCoupon();

      set({
        cart: response.data.data.items || [],
        loading: false
      });
    } catch (error) {
      console.error('Failed to remove coupon:', error);
      set({
        error: error.response?.data?.message || 'Failed to remove coupon',
        loading: false
      });
    }
  },

  // Get total price
  getTotal: () => {
    const cart = get().cart;
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  // Get item count
  getItemCount: () => {
    const cart = get().cart;
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useCartStore;