const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// --- CÁC ROUTE CÁ NHÂN (USER THƯỜNG DÙNG ĐƯỢC) ---

// Xem profile: GET /api/users/profile
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);

router.post("/reset-password", userController.resetPassword);
router.post("/send-reset-pin", userController.sendResetPin);
router.post("/verify-pin", userController.verifyPin);

// Đổi mật khẩu: POST /api/users/change-password
router.put("/change-password", authMiddleware, userController.changePassword);

// --- CÁC ROUTE QUẢN TRỊ (ADMIN MỚI DÙNG ĐƯỢC) ---

router.get("/", roleMiddleware, userController.getAllUsers);
router.put("/:id/lock", roleMiddleware, userController.updateLockStatus);

router.put("/:id/role", roleMiddleware, userController.updateUserRole);

module.exports = router;
