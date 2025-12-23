const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");

// Các route cơ bản cho Author
router.get("/", authorController.getAuthors);
router.post("/", authorController.addAuthor);
router.get("/:id", authorController.getAuthorDetail);

module.exports = router;
