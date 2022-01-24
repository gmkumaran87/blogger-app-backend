const User = require("../models/User");
const {
    AccountExistsError,
    BadRequestError,
    UnauthenticatedError,
} = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const sendGridMail = require("../utility/sendMail");
const { attachCookiesToResponse, jsonToken } = require("../utility/helper");

/*const {
    connectDB,
    hashPassword,
    randomStringGenerator,
    jsonToken,
    comparePassword,
} =
from "../utility/helper.js";*/
// import { compareSync } from "bcryptjs";

const registerUser = async(req, res) => {
    const { username, email, password } = req.body;

    const emailExists = await User.findOne({ email });

    if (emailExists) {
        throw new BadRequestError("Email already Exists");
    }

    // Creating Confirmation token
    const confirmationToken = jsonToken({
        email,
        randomId: Math.floor(Math.random() * 100) + 1,
    });

    req.body.confirmationCode = confirmationToken;
    req.body.isActive = false;

    const user = await User.create(req.body);
    console.log(user);

    const jsonUserDetails = {
        username: user.username,
        email: user.email,
        userId: user._id,
    };

    attachCookiesToResponse(res, jsonUserDetails);

    // Account Activation link
    const activationLink = `${process.env.ACCOUNT_ACTIVATION_URL}/${confirmationToken}`;

    // Sending email
    const mailInfo = sendGridMail(
        req.body.email,
        activationLink,
        "activating your account"
    );

    res
        .status(StatusCodes.CREATED)
        .json({ msg: "Registered the User, Please login", user });
};

const loginUser = async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please provide email and passowrd");
    }

    const user = await User.findOne({ email });

    // DB Connection and insertion
    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials");
    }

    console.log("Email and Password", user, email, password);

    const isPasswordCorrect = await user.comparePassword(password);

    console.log("After Password", isPasswordCorrect);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Credentials");
    }

    console.log("After Password Validation");
    const jsonUserDetails = {
        username: user.username,
        email: user.email,
        userId: user._id,
    };

    console.log("Json User", jsonUserDetails);

    attachCookiesToResponse(res, jsonUserDetails);

    console.log("Before status");
    res.status(StatusCodes.CREATED).json({
        msg: "User Logged in successfully...",
        user,
    });
};

const logout = (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });

    res.status(StatusCodes.OK).json({ msg: "User logged out successfully" });
};
const forgotPassword = async(req, res) => {
    // DB Connection and insertion
    const db = await connectDB();
    const userExists = await db.collection("users").findOne(req.body);

    if (userExists) {
        // Ge
        const userId = userExists._id;
        const randomString = randomStringGenerator(20);

        const updatedStr = await db
            .collection("users")
            .updateOne({ _id: userId }, { $set: { randomStr: randomString } });

        const resetLink = `${process.env.FORGOT_PASSWORD_URL}/${userId}/${randomString}`;
        // Sending email
        const mailInfo = sendGridMail(
            req.body.email,
            resetLink,
            "resetting the Password"
        );

        res.status(200).json({
            msg: "Please check your email for the Password reset Link",
        });
    } else {
        res.status(404).json({
            msg: "User account does not exists, please enter valid email id",
        });
    }
};

const emailValidation = async(req, res) => {
    const { userId, randomStr } = req.params;

    const db = await connectDB();
    const userExists = await db
        .collection("users")
        .findOne({ _id: ObjectId(userId), randomStr: randomStr });

    if (userExists) {
        res.status(StatusCodes.OK).json({
            msg: "Password Reset link validation is successfull",
            userExists,
        });
    } else {
        throw new BadRequestError("Link is not valid, please check");
    }
};

const updatePassword = async(req, res) => {
    const { confirmPassword, userId, randomStr } = req.body;

    // Hashing the Password
    const hashedPassword = await hashPassword(confirmPassword);

    const db = await connectDB();
    const userExists = await db
        .collection("users")
        .findOne({ _id: ObjectId(userId), randomStr: randomStr });

    if (userExists) {
        const updatedUser = await db
            .collection("users")
            .updateOne({ _id: ObjectId(userId) }, { $set: { password: hashedPassword, randomStr: "" } });

        res
            .status(StatusCodes.OK)
            .json({ msg: "Password updated successfully", updatedUser });
    } else {
        throw new UnauthenticatedError("Invalid Credentials");
    }
};
const accountActivation = async(req, res) => {
    const { confirmationCode } = req.params;

    const db = await connectDB();
    const userExists = await db.collection("users").findOne({
        confirmationCode: confirmationCode,
    });

    if (userExists) {
        await db
            .collection("users")
            .updateOne({ _id: userExists._id }, { $set: { isActive: true } });

        res.status(StatusCodes.OK).json({
            msg: "Account activation link validation is successfull",
            userExists,
        });
    } else {
        res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Activation link is not valid" });
    }
};

const getUser = (req, res) => {
    res.send("Users list");
    console.log(req.user);
};
module.exports = {
    registerUser,
    forgotPassword,
    emailValidation,
    loginUser,
    logout,
    updatePassword,
    accountActivation,
    getUser,
};