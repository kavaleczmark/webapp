const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PW,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT,
        define: {
            timestamps: false,
            freezeTableName: true,
        },
    }
);
sequelize
    .sync({
        force: false
    })
    .then(()=>{
        console.log("Database connected!");
    })
    .catch((error)=>{
        console.error("Failed to connect to database! ",error);
    })

module.exports = sequelize;