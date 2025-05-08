const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const NotesHistory = sequelize.define("noteshistory", {
    notes_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    version_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

module.exports = NotesHistory;