const User = require("../models/User");
const {
    AccountExistsError,
    BadRequestError,
    UnauthenticatedError,
} = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const sendGridMail = require("../utility/sendMail");
const { jsonToken, isTokenValid } = require("../utility/helper");

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

    console.log(req.body);

    const emailExists = await User.findOne({ email });

    if (emailExists) {
        throw new BadRequestError("Email already Exists");
    }

    const user = await User.create(req.body);
    console.log(user);

    const jsonUserDetails = {
        username: user.username,
        email: user.email,
        userId: user._id,
    };

    const token = jsonToken(jsonUserDetails);

    const oneDay = 1000 * 60 * 60 * 24; // One day in milli seconds
    // Sending the Cookies
    res.cookie("token", token, {
        expires: new Date(Date.now() + oneDay),
        httpOnly: true,
    });
    /*
                          // Finding the User present in the DB
                          const userExists = await db.collection("users").findOne({ email: email });

                          if (userExists) {
                              throw new AccountExistsError("Email already exists");
                          }

                          // Hashing the Password
                          const hashedPassword = await hashPassword(password);

                          // Creating Confirmation token
                          const confirmationToken = jsonToken(
                              email,
                              Math.floor(Math.random() * 100) + 1
                          );

                          console.log("token", confirmationToken);

                          const userObj = {
                              firstName,
                              lastName,
                              email,
                              password: hashedPassword,
                              isActive: false,
                              confirmationCode: confirmationToken,
                          };

                          // Inserting into the DB with user details
                          const user = await db.collection("users").insertOne(userObj);

                          // Account Activation link
                          const activationLink = `${process.env.ACCOUNT_ACTIVATION_URL}/${confirmationToken}`;

                          // Sending email
                          const mailInfo = sendGridMail(
                              req.body.email,
                              activationLink,
                              "activating your account"
                          );*/

    res
        .status(StatusCodes.CREATED)
        .json({ msg: "Registered the User, Please login", user });
};

const loginUser = (req, res) => {
    res.send("Login user");
    /*const { email, password } = req.body;

                              if (!email || !password) {
                                  throw new BadRequestError("Please provide email and passowrd");
                              }
                              // DB Connection and insertion
                              const db = await connectDB();
                              const user = await db.collection("users").findOne({ email: req.body.email });

                              if (!user) {
                                  throw new UnauthenticatedError("Invalid Credentials");
                              }

                              const isCorrect = await comparePassword(password, user.password);
                              console.log(isCorrect);
                              if (!isCorrect) {
                                  throw new UnauthenticatedError("Invalid Credentials");
                              }

                              const token = jsonToken(email, user._id);

                              console.log("Token generated", token);
                              res.status(StatusCodes.CREATED).json({
                                  msg: "User Logged in successfully...",
                                  userName: user.firstName,
                                  userId: user._id,
                                  token,
                              });*/
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
module.exports = {
    registerUser,
    forgotPassword,
    emailValidation,
    loginUser,
    updatePassword,
    accountActivation,
};