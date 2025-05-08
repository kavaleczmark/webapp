const express = require("express");
const router = express.Router();

const {
    login,
    register,
    refresh,
    getUserData,
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

router.post("/login", login);
router.post("/registration", register);
router.get("/refresh", refresh);
router.get("/userData",requireAuth ,getUserData);


module.exports = router;