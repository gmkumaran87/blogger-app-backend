import Jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

const { verify } = Jwt;

const authentication = async(req, res, next) => {
    const header = req.headers.authorization;

    if (!header || header.split(" ")[0] != "Bearer") {
        throw new UnauthenticatedError("Invalid Authentication");
    }

    const token = header.split(" ")[1];

    try {
        const tokenValid = verify(token, process.env.JWT_SECRET);
        console.log("Token processed", tokenValid);
        req.user = { userId: tokenValid.id, email: tokenValid.email };
        next();
    } catch (error) {
        throw new UnauthenticatedError("Invalid Authentication");
    }
};

export default authentication;