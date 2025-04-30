require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
)
app.use(express.json());

app.listen(process.env.PORT);