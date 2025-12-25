const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const roleMiddleware = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/imageMiddleware");

// 1. GET /api/banner/hero-slides
router.get("/hero-slides", roleMiddleware, bannerController.getHeroSlides);

// 2. GET /api/banner/:id (Đã sửa: Bỏ chữ /banner thừa)
router.get("/:id", bannerController.getDetail);

// 3. POST /api/banner (Tạo mới)
router.post(
  "/",
  roleMiddleware,
  upload.single("image"),
  bannerController.createBanner
);

// 4. PUT /api/banner/update/:id (Cập nhật)
router.put(
  "/update/:id",
  roleMiddleware,
  upload.single("image"),
  bannerController.updateBanner
);

// 5. DELETE /api/banner/:id (Xóa mềm)
router.delete("/:id", roleMiddleware, bannerController.deleteBanner);

// 6. PUT /api/banner/:id/restore (Khôi phục)
router.put("/:id/restore", roleMiddleware, bannerController.restoreBanner);

module.exports = router;
