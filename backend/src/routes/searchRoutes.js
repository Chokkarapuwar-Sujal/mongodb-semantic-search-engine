const express = require("express");
const { searchDocuments } = require("../controllers/searchController");

const router = express.Router();

router.post("/search", searchDocuments);

module.exports = router;
