const jwt = require("jsonwebtoken");
const config = require('../config/config');

const verificationLib = {
    // Middleware is just a function that takes the request, the result and next
    verifyToken: (req,res,next) => {
        var bearerToken = req.headers['authorization'];
        // It exists and it includes Bearer
        if (bearerToken && bearerToken.includes("Bearer")) {
            // Splits the token and gets the second half
            // "Bearer <JWT>"
            jwtToken=bearerToken.split(" ")[1];

            // Verification
            jwt.verify(jwtToken, config.secretKey, (err,decoded) => {
                // Wrong JWT
                if (err) {
                    res.type("application/json");
                    res.status(403);
                    res.send(`{"Auth": "${false}", "error_msg":"Not Authorized"}`);
                } else {
                    req.user_id=decoded.user_id;
                    req.first_name=decoded.first_name;
                    req.last_name=decoded.last_name;
                    req.email=decoded.email;
                    req.isStaff=decoded.isStaff;
                    next();
                }
            });
        // Never include JWT
        } else {
            res.type("application/json");
            res.status(403);
            res.send(`{"Auth": "${false}", "error_msg":"Not Authorized"}`);
        }
    }
}

// JWT is a form of bearer authentication

module.exports = verificationLib;
