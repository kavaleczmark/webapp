const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Notes = sequelize.define("notes", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

module.exports = Notes;