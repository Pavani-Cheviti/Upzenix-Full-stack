import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (itemData) => api.post('/cart', itemData),
  updateCartItem: (productId, updateData) => api.put(`/cart/${productId}`, updateData),
  removeFromCart: (productId, removeData) => api.delete(`/cart/${productId}`, { data: removeData }),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (couponData) => api.post('/cart/coupon', couponData),
  removeCoupon: () => api.delete('/cart/coupon'),
};

// Orders API
export const ordersAPI = {
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  updateOrderStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData),
  getAllOrders: () => api.get('/orders/admin/all'),
};

// Users API (Admin)
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats/overview'),
};

export default api;