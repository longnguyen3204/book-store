const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route lấy danh sách review theo ID sách
router.get("/book/:id", authMiddleware, reviewController.getReviewsByBook);

// Route thêm review mới
router.post("/", authMiddleware, reviewController.addReview);

module.exports = router;
