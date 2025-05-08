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
});

module.exports = Notes;