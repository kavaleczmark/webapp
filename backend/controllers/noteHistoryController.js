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

module.exports = {
  getLatestNotesForUser
};
