const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const roleMiddleware = require("../middlewares/roleMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/imageMiddleware");

// Routes
router.get("/", bookController.getBooks);

router.get("/all", bookController.getAll);

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
