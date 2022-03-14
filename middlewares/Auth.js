const {
    validationResult
} = require("express-validator");
const {
    TokenExpiredError
} = require("jsonwebtoken");
const {
    JsonWebTokenError
} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

function collectToken(req) {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        return req.headers.authorization.split(" ")[1];
    }
    return null
}

module.exports = isLoggedIn = async (req, res, next) => {
    try {
        const token = collectToken(req)
        if (!token) {
            return res.json({
                msg: "auth token is empty"
            })
        }

        jwt.verify(token, process.env.SECRET, (err, payload) => {
            if (err) {
                msg = err.name === "JsonWebTokenError" ? "unauthorized" : err.message
                return res.json({
                    msg: msg
                })
            }
            req.payload = payload
            next()
        })

    } catch (error) {
        if (error) {
           
            res.json({
                msg: "server error"
            })
        }
    }

}