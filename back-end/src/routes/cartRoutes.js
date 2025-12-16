const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

// Lấy giỏ hàng của user
router.get('/', authMiddleware, cartController.getCart);

// Thêm vào giỏ (nếu đã có thì cộng dồn)
router.post('/add', authMiddleware, cartController.addItem);

// Tính tổng tiền (tất cả hoặc sách được chọn)
router.post('/total', authMiddleware, cartController.calculateTotal);

// Cập nhật số lượng tuyệt đối cho 1 book trong giỏ
router.put('/item/:bookId', authMiddleware, cartController.updateItem);

// Xóa 1 book khỏi giỏ
router.delete('/item/:bookId', authMiddleware, cartController.removeItem);

module.exports = router;
