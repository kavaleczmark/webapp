const express = require("express");
const router = express.Router();

const {
    getLatestNotesForUser,
} = require("../controllers/noteHistoryController");
const requireAuth = require("../middleware/requireAuth");

router.post("/getNotes", getLatestNotesForUser);

module.exports = router;