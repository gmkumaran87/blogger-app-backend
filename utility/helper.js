// import { genSalt, hash, compare } from "bcryptjs";
import bc from "bcryptjs";
import dbConnection from "../db/connect.js";
import { randomBytes } from "crypto";
import Jwt from "jsonwebtoken";
import { lookup } from "dns";

const { genSalt, hash, compare } = bc;
const { sign } = Jwt;

const connectDB = async() => {
    const client = dbConnection();
    const db = (await client).db("UrlShortener");
    return db;
};

const hashPassword = async(password) => {
    const salt = await genSalt(10);
    return await hash(password, salt);
};

const comparePassword = async(enteredPassword, password) => {
    const isCorrect = await compare(enteredPassword, password);
    return isCorrect;
};
const randomStringGenerator = (length) => randomBytes(length).toString("hex");

const jsonToken = (email, userId) => {
    const token = sign({ email: email, id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
};

const verifyUrl = (host) => {
    return new Promise((resolve, reject) => {
        lookup(host, (err, address, family) => {
            if (err) {
                reject("Invalid URL");
            }
            console.log("Url address", address, family);
            resolve("URL is good.");
        });
    });
};

const currentCount = (arr, dayMonth) => {
    let currentMonth = 0;
    let currentDay = 0;

    currentMonth = new Date().getMonth() + 1;
    currentDay = new Date().getDate();

    const currentMonthUrl = arr.filter((el) => {
        const createdMonthUrl = new Date(el.createdAt).getMonth() + 1;

        if (currentMonth === createdMonthUrl) {
            return true;
        }
        return false;
    });

    const currentDateUrl = arr.filter(
        (el) => currentDay === new Date(el.createdAt.getDate())
    );

    return {
        monthUrlCount: currentMonthUrl.length,
        dayUrlCount: currentDateUrl.length,
    };
};
export {
    connectDB,
    hashPassword,
    randomStringGenerator,
    jsonToken,
    comparePassword,
    verifyUrl,
    currentCount,
};