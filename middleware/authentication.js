const { UnauthenticatedError } = require("../errors/index");
const { isTokenValid } = require("../utility/helper");

const authentication = async(req, res, next) => {
    const header = req.headers.authorization;

    if (!header || header.split(" ")[0] != "Bearer") {
        throw new UnauthenticatedError("Invalid Authentication");
    }

    const token = header.split(" ")[1];

    console.log("Token in authentication", token);

    /*  const token = req.signedCookies.token;

            const tokenReceived = req.cookies.token;

            console.log("token", req.cookies, token, tokenReceived);

            if (!token) {
                throw new UnauthenticatedError("Invalid Authentication");
            }*/

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