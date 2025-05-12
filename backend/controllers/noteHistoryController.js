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
          attributes: ["notes_id","version_id", "title", "text", "date"],
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

    res.status(200).json({
      message: "Jegyzet sikeresen létrehozva",
      noteId: newNote.id,
      version: history
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Hiba történt a jegyzet létrehozásakor" });
  }
};

const deleteNoteAndHistory = async (req, res) => {
    const userId = req.user.id;
    const noteIdToDelete = req.params.id;
    console.log(noteIdToDelete);
    if (!noteIdToDelete) {
        return res.status(400).json({ error: "Hiányzó jegyzet azonosító!" });
    }

    try {
        const note = await Notes.findOne({
            where: {
                id: noteIdToDelete,
                user_id: userId
            }
        });

        if (!note) {
             const existsButWrongUser = await Notes.findOne({
                 where: { id: noteIdToDelete }
             });
             if (existsButWrongUser) {
                 return res.status(403).json({ error: "Nincs jogosultságod törölni ezt a jegyzetet!" });
             } else {
                 return res.status(404).json({ error: "Jegyzet nem található!" });
             }
        }

        await NotesHistory.destroy({
            where: {
                notes_id: noteIdToDelete
            }
        });

        await Notes.destroy({
            where: {
                id: noteIdToDelete
            }
        });

        res.status(200).json({ message: "Jegyzet és előzményei sikeresen törölve!" });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Hiba történt a jegyzet törlésekor!" });
    }
};

const saveNoteVersion = async (req, res) => {
  const { notesId, title, text } = req.body;

  try {
    const lastVersion = await NotesHistory.findOne({
      where: { notes_id: notesId },
      order: [["version_id", "DESC"]],
    });

    const newVersionId = lastVersion ? lastVersion.version_id + 1 : 1;

    const newHistory = await NotesHistory.create({
      notes_id: notesId,
      version_id: newVersionId,
      title,
      text,
      date: new Date(),
    });

    res.status(200).json({
      message: "Új verzió elmentve",
      version: newHistory,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Mentési hiba" });
  }
};

const getNoteVersions = async (req, res) => {
  const { noteId } = req.params;

  try {
    const versions = await NotesHistory.findAll({
      where: { notes_id: noteId },
      order: [["version_id", "DESC"]],
    });

    res.status(200).json(versions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Verziók lekérdezése sikertelen" });
  }
};

module.exports = {
  getLatestNotesForUser,
  createNote,
  deleteNoteAndHistory,
  saveNoteVersion,
  getNoteVersions,
};
