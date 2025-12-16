const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Lịch sử đơn hàng của user (có thể lọc theo status)
router.get('/history', authMiddleware, orderController.getHistory);

module.exports = router;
