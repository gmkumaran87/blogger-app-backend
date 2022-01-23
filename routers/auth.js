const express = require("express");

const {
    registerUser,
    forgotPassword,
    loginUser,
    emailValidation,
    updatePassword,
    accountActivation,
} = require("../controllers/auth");

const authRouter = express.Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/validation/:userId/:randomStr").post(emailValidation);
authRouter.route("/confirm/:confirmationCode").get(accountActivation);

module.exports = authRouter;