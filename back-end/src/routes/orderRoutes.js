const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Lịch sử đơn hàng của user (có thể lọc theo status)
router.get("/", roleMiddleware, orderController.getAllOrders);
router.get("/history", authMiddleware, orderController.getHistory);
router.put("/:id/status", roleMiddleware, orderController.updateOrderStatus);

// Đặt hàng
router.post("/", authMiddleware, orderController.placeOrder);

// Hủy đơn
router.post("/:id/cancel", authMiddleware, orderController.cancelOrder);

module.exports = router;
