const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/", authMiddleware, voucherController.getActive);

router.get("/all", roleMiddleware, voucherController.getAllVouchers);
router.post("/", roleMiddleware, voucherController.addVoucher);
router.put("/:id", roleMiddleware, voucherController.updateVoucher);
router.delete("/:id", roleMiddleware, voucherController.deleteVoucher);
router.patch("/:id/restore", roleMiddleware, voucherController.restoreVoucher);
module.exports = router;
