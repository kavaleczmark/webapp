const webtoken = require("jsonwebtoken");
const crypto = require("crypto");
const sha1 = (data) => {
    return crypto.createHash("sha1").update(data).digest("hex");
};
const createToken = (id) => {
    return webtoken.sign({id}, process.env.SECRET, {
        expiresIn: "10m"
    })
}
const createRefreshToken = (id) => {
    return webtoken.sign({id}, process.env.REFRESH_SECRET, {
        expiresIn: "1d"
    })
}
module.exports = {
    sha1,
    createToken,
    createRefreshToken
}