const User = require("../models/user");
const { sha1, createAccessToken, createRefreshToken } = require("../utils/userUtils");
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;
const jwt = require("jsonwebtoken");

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

const register = async (req, res) => {
  const {username, password, repassword} = req.body;
  try {
    if (
      !username ||
      !password ||
      !repassword
    ) {
      throw Error("Töltse ki a kötelező mezőket!");
    }
    if (password !== repassword) {
      throw Error("A két jelszó nem egyezik!");
    }
    let user = await User.findOne({
      attributes: ["username"],
      where: { username: username },
    });
    if (user) {
      throw Error("Ez a felhasználónév már létezik!");
    }
    const response = await User.create(
      {
        username: username,
        password: sha1(password)
      },
      {
        fields: [
          "username",
          "password"
        ],
      }
    );

    if (response !== null) {
      const token = createToken(response.get("id"));
      res.cookie("user", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: FIFTEEN_MINUTES,
      });

      const refreshToken = createRefreshToken(response.get("id"));
      res.cookie("refresh", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: ONE_DAY,
      });

      console.log(response.get("id"));
      res.status(200).json({
        message: "ok",
      });
      return;
    }
    throw Error("Valami hiba történt!");
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      error: error.message,
    });
  }
};
module.exports = {
    login,
    register
};