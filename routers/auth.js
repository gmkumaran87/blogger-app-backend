const express = require("express");

const {
    registerUser,
    forgotPassword,
    loginUser,
    logout,
    emailValidation,
    updatePassword,
    accountActivation,
    getUser,
} = require("../controllers/auth");

const authentication = require("../middleware/authentication");

const authRouter = express.Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/logout").get(logout);
authRouter.route("/validation/:userId/:randomStr").post(emailValidation);
authRouter.route("/confirm/:confirmationCode").get(accountActivation);
authRouter.route("/get-user").get(authentication, getUser);

module.exports = authRouter;