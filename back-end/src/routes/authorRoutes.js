const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");

router.get("/", authorController.getAuthors);
router.post("/", authorController.addAuthor);
router.get("/:id", authorController.getAuthorDetail);

module.exports = router;
