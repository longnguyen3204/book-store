const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', bookController.getBooks); // Lấy danh sách sách
router.post('/', roleMiddleware, bookController.addBook); // Thêm sách

module.exports = router;