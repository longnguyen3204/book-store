const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, cartController.getCart);
router.post("/add", authMiddleware, cartController.addItem);
router.post("/total", authMiddleware, cartController.calculateTotal);
router.put("/item/:bookId", authMiddleware, cartController.updateItem);
router.delete("/item/:bookId", authMiddleware, cartController.removeItem);

module.exports = router;
