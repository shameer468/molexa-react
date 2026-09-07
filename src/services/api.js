import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============ PRODUCTS ============
export const getProducts = () => api.get('/products');

// ============ USERS ============
export const getUsers = () => api.get('/users');
export const createUser = (data) => api.post('/users', data);

// ============ ORDERS ============
export const getOrders = () => api.get('/orders');
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);

// ============ MESSAGES ============
export const getMessages = () => api.get('/messages');
export const createMessage = (data) => api.post('/messages', data);
export const markMessageRead = (id) => api.put(`/messages/${id}`);

// ============ STATS ============
export const getStats = () => api.get('/stats');

export default api;