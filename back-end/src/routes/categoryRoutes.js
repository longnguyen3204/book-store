const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryBooks);

router.post("/", roleMiddleware, categoryController.addCategory);
router.put("/:id", roleMiddleware, categoryController.updateCategory);
router.delete("/:id", roleMiddleware, categoryController.delCategory);

module.exports = router;
