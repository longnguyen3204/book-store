const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/", roleMiddleware, orderController.getAllOrders);
router.put("/:id/status", roleMiddleware, orderController.updateOrderStatus);

router.get("/history", authMiddleware, orderController.getHistory);
router.post("/", authMiddleware, orderController.placeOrder);
router.post("/:id/cancel", authMiddleware, orderController.cancelOrder);

module.exports = router;
