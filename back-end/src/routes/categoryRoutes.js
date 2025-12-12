const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', categoryController.getCategories); // Lấy danh sách thể loại
router.get('/:id', categoryController.getCategoryBooks); // Xem các sách của thể loại đó 
router.post('/', roleMiddleware, categoryController.addCategory); // Thêm thể loại
router.put('/:id', roleMiddleware, categoryController.updateCategory); // Cập nhật thể loại
router.delete('/:id', roleMiddleware, categoryController.delCategory); // Xóa thể loại

module.exports = router;