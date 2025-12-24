const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");

router.get("/banner", statisticsController.getHeroSlides);
router.get("/featured_books", statisticsController.getFeaturedBooks);
router.get("/popular-tabs", statisticsController.getPopularTabs);
router.get("/best-selling", statisticsController.getBestSelling);
router.get("/special_offers", statisticsController.getSpecialOffers);

module.exports = router;
