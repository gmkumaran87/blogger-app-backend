const { UnauthenticatedError } = require("../errors/index");
const { isTokenValid } = require("../utility/helper");

const authentication = async(req, res, next) => {
    // const header = req.headers.authorization;

    const token = req.signedCookies.token;

    if (!token) {
        throw new UnauthenticatedError("Invalid Authentication");
    }

    try {
        const tokenValid = isTokenValid(token);

        console.log("Token processed", tokenValid);
        req.user = {
            userId: tokenValid.userId,
            email: tokenValid.email,
            firstName: tokenValid.firstName,
        };
        next();
    } catch (error) {
        throw new UnauthenticatedError("Invalid Authentication");
    }
};

module.exports = authentication;