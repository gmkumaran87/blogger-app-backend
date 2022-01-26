const express = require("express");
require("dotenv").config();
// import { er } from "express-async-errors";
require("express-async-errors");

const connectDB = require("./db/connect");
// Security Libraries
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
// const rateLimiter = require("express-rate-limit");

const morgan = require("morgan");
const app = express();

// Routers
const authrouter = require("./routers/auth");
const postRouter = require("./routers/post");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authrouter);
app.use("/api/v1/posts", postRouter);

app.get("/", (req, res) => {
    console.log(req.signedCookies);
    res.send("Welcome to the Blogger App home page");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.get("*", (req, res) => {
    console.log(req.url);
    res.status(404).send("Page not found...!");
});

const port = process.env.PORT;

const start = async() => {
    try {
        const db = await connectDB();
        app.listen(port, () => console.log("App started in the port -", port));
    } catch (error) {
        console.log(error);
    }
};

start();