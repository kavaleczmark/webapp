const User = require("../models/user");
const { sha1, createAccessToken, createRefreshToken } = require("../utils/userUtils");
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        throw Error("Töltse ki a kötelező mezőket!");
      }
  
      const user = await User.findOne({
        attributes: ["username", "id"],
        where: {
          username: username,
          password: sha1(password),
        },
      });
  
      if (!user) {
        throw Error("Hibás felhasználónév vagy jelszó!");
      }
      const token = createAccessToken(user.id);
      res.cookie("user", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: FIFTEEN_MINUTES,
      });
  
      const refreshToken = createRefreshToken(user.id);
      res.cookie("refresh", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: ONE_DAY,
      });
  
      res.status(200).json({
        username: username
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({
        error: error.message,
      });
    }
};

module.exports = {
    login
};