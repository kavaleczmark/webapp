const webtoken = require("jsonwebtoken");
const crypto = require("crypto");
const sha1 = (data) => {
    return crypto.createHash("sha1").update(data).digest("hex");
};
const createAccessToken = (id) => {
    return webtoken.sign({id}, process.env.SECRET, {
        expiresIn: "15m"
    })
}
const createRefreshToken = (id) => {
    return webtoken.sign({id}, process.env.REFRESH_SECRET, {
        expiresIn: "1d"
    })
}
module.exports = {
    sha1,
    createAccessToken,
    createRefreshToken
}