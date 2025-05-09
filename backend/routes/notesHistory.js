const express = require("express");
const router = express.Router();

const {
    getLatestNotesForUser,
    createNote
} = require("../controllers/noteHistoryController");
const requireAuth = require("../middleware/requireAuth");

router.get("/getNotes",requireAuth, getLatestNotesForUser);
router.post("/create",requireAuth, createNote);
module.exports = router;