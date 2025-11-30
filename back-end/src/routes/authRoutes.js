const express = require('express');
const router = express.Router();
// Gọi file Controller vào để xử lý
const authController = require('../controllers/authController');

// Định nghĩa đường dẫn: http://localhost:3000/api/auth/register
router.post('/register', authController.register);

// Định nghĩa đường dẫn: http://localhost:3000/api/auth/login
router.post('/login', authController.login);

module.exports = router;