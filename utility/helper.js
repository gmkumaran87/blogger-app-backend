const jwt = require("jsonwebtoken");
// const jwt = require("jsonwebtok");

// import dbConnection from "../db/connect.js";
// const  { randomBytes } = require() "crypto";
/*const bcrypt = require("bcryptjs");


const { genSalt, hash, compare } = bc;
const { sign } = Jwt;


const randomStringGenerator = (length) => randomBytes(length).toString("hex");*/

const jsonToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
    // randomStringGenerator,
    jsonToken,
    isTokenValid,
};