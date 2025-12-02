const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // Gọi bảo vệ vào

// --- CÁC ROUTE CẦN ĐĂNG NHẬP MỚI DÙNG ĐƯỢC ---

// Xem profile: GET /api/users/profile
router.get('/profile', authMiddleware, userController.getProfile);

// Sửa profile: PUT /api/users/profile
router.put('/profile', authMiddleware, userController.updateProfile);

// Đổi mật khẩu: POST /api/users/change-password
router.post('/change-password', authMiddleware, userController.changePassword);

module.exports = router;