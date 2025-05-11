const express = require("express");
const router = express.Router();

const {
    getLatestNotesForUser,
    createNote,
    deleteNoteAndHistory
} = require("../controllers/noteHistoryController");
const requireAuth = require("../middleware/requireAuth");

router.get("/getNotes",requireAuth, getLatestNotesForUser);
router.post("/create",requireAuth, createNote);
router.delete('/delete/:id', requireAuth, deleteNoteAndHistory);
module.exports = router;