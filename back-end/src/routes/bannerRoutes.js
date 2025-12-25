const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const roleMiddleware = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/imageMiddleware");

router.get("/hero-slides", roleMiddleware, bannerController.getHeroSlides);
router.get("/:id", bannerController.getDetail);

router.post(
  "/",
  roleMiddleware,
  upload.single("image"),
  bannerController.createBanner
);
router.put(
  "/update/:id",
  roleMiddleware,
  upload.single("image"),
  bannerController.updateBanner
);
router.delete("/:id", roleMiddleware, bannerController.deleteBanner);
router.put("/:id/restore", roleMiddleware, bannerController.restoreBanner);

module.exports = router;
