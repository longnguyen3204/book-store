const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const roleMiddleware = require("../middlewares/roleMiddleware");
const multer = require("multer");

// Cấu hình multer lưu tạm
const upload = multer({ dest: "uploads/" });

// Routes
router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBookDetail);
router.post(
  "/",
  roleMiddleware,
  upload.single("image"),
  bookController.addBook
);
router.put(
  "/:id",
  roleMiddleware,
  upload.single("image"),
  bookController.updateBook
);
router.delete("/:id", roleMiddleware, bookController.delBook);
router.put("/:id/restore", roleMiddleware, bookController.restoreBook);

module.exports = router;
