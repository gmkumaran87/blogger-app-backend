const jwt = require("jsonwebtoken");

// const randomStringGenerator = (length) => randomBytes(length).toString("hex");

const jsonToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = (res, payload) => {
    const token = jsonToken(payload);

    const oneDay = 1000 * 60 * 60 * 24; // One day in milli seconds

    // Sending the Cookies
    res.cookie("token", token, {
        expires: new Date(Date.now() + oneDay),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
    });

    // res.status(200).json({ user: payload.jsonUserDetails, token });
};
module.exports = {
    // randomStringGenerator,
    jsonToken,
    isTokenValid,
    attachCookiesToResponse,
};