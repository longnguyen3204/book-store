const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/", bookController.getBooks); // Lấy danh sách sách
router.get("/:id", bookController.getBookDetail); // Xem thông tin của 1 quyển sách
router.post("/addBook", roleMiddleware, bookController.addBook); // Thêm sách
router.put("/:id", roleMiddleware, bookController.updateBook); // Cập nhật thông tin sách
router.delete("/:id", roleMiddleware, bookController.delBook); // Xóa sách
router.put("/:id/restore", roleMiddleware, bookController.restoreBook); // Hiện sách

module.exports = router;
