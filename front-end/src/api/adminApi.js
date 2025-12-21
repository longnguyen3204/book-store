import axios from 'axios';

// Cấu hình base URL (chỉnh lại port backend của bạn, ví dụ 5000 hoặc 8080)
const API_URL = 'http://localhost:5000/api'; 

// Hàm lấy token từ localStorage để xác thực admin
const getAuthHeader = () => {
    const token = localStorage.getItem('token'); 
    return { headers: { Authorization: `Bearer ${token}` } };
};

const adminApi = {
    // --- QUẢN LÝ SÁCH ---
    getAllBooks: () => axios.get(`${API_URL}/books`),
    createBook: (data) => axios.post(`${API_URL}/books`, data, {
        headers: { ...getAuthHeader().headers, 'Content-Type': 'multipart/form-data' } // Nếu có up ảnh
    }),
    updateBook: (id, data) => axios.put(`${API_URL}/books/${id}`, data, {
        headers: { ...getAuthHeader().headers, 'Content-Type': 'multipart/form-data' }
    }),
    deleteBook: (id) => axios.delete(`${API_URL}/books/${id}`, getAuthHeader()),

    // --- QUẢN LÝ DANH MỤC ---
    getAllCategories: () => axios.get(`${API_URL}/categories`),
    createCategory: (data) => axios.post(`${API_URL}/categories`, data, getAuthHeader()),
    deleteCategory: (id) => axios.delete(`${API_URL}/categories/${id}`, getAuthHeader()),

    // --- QUẢN LÝ ĐƠN HÀNG ---
    getAllOrders: () => axios.get(`${API_URL}/orders`, getAuthHeader()),
    updateOrderStatus: (id, status) => axios.put(`${API_URL}/orders/${id}`, { status }, getAuthHeader()),

    // --- QUẢN LÝ NGƯỜI DÙNG ---
    getAllUsers: () => axios.get(`${API_URL}/users`, getAuthHeader()),
    updateUserRole: (id, role) => axios.put(`${API_URL}/users/${id}/role`, { role }, getAuthHeader()),
};

export default adminApi;