const express = require("express");
const { cacheMiddleware } = require("../lib/cache");
const { fetchFAQs,removeFAQ,createFAQ } = require("../controllers/faq.controller");

const router = express.Router();

router.get("/", cacheMiddleware, fetchFAQs);
router.post("/", createFAQ);
router.delete("/:id", removeFAQ);

module.exports = router;