const User = require("../models/users");
const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies || !cookies.user) {
      return res.status(401).json({ error: "Authorization token required" });
    }
    try { 
      const { id } = jwt.verify(cookies.user, process.env.SECRET);
      req.user = await User.findOne({
          where : {id : id}
      });
      if (!req.user) {
        throw Error("User doesn't exits");
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Request is not authorized" });
    }
};
module.exports = requireAuth;