import { Router } from "express";
import {
    registerUser,
    forgotPassword,
    loginUser,
    emailValidation,
    updatePassword,
    accountActivation,
} from "../controllers/auth.js";

const authRouter = Router();

authRouter.route("/login").post(loginUser);
authRouter.route("/validation/:userId/:randomStr").post(emailValidation);
authRouter.route("/confirm/:confirmationCode").get(accountActivation);

export default authRouter;