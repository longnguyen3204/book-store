const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Lịch sử đơn hàng của user (có thể lọc theo status)
router.get('/history', authMiddleware, orderController.getHistory);

// Đặt hàng
router.post('/', authMiddleware, orderController.placeOrder);

// Hủy đơn
router.post('/:id/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;
