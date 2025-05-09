const Notes = require("../models/notes");
const NotesHistory = require("../models/notesHistory");

const getLatestNotesForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const notes = await Notes.findAll({
      where: { user_id: userId },
      attributes: ["id"],
      raw: true
    });

    const result = await Promise.all(
      notes.map(async (note) => {
        const latest = await NotesHistory.findOne({
          where: { notes_id: note.id },
          order: [["version_id", "DESC"]],
          attributes: ["version_id", "title", "text", "date"],
          raw: true
        });

        return {
          noteId: note.id,
          latestVersion: latest || null
        };
      })
    );

    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Hiba történt a jegyzetek lekérdezésekor" });
  }
};

const createNote = async (req, res) => {
  const userId = req.user.id;

  try {
    const newNote = await Notes.create({ user_id: userId });
    const history = await NotesHistory.create({
      notes_id: newNote.id,
      version_id: 1,
      title: req.body.title || "Névtelen jegyzet",
      text: req.body.text || "",
      date: new Date()
    });

    res.status(201).json({
      message: "Jegyzet sikeresen létrehozva",
      noteId: newNote.id,
      version: history
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Hiba történt a jegyzet létrehozásakor" });
  }
};

module.exports = {
  getLatestNotesForUser,
  createNote
};
