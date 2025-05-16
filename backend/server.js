require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(
    cors({
        origin: "https://webapp-w18d.vercel.app",
        credentials: true
    })
)
app.use(express.json());
app.use(cookieParser());
const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

const notesHistoryRoutes = require("./routes/notesHistory");
app.use("/notes", notesHistoryRoutes);

app.listen(process.env.PORT);