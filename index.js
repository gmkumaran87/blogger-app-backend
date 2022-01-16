import express, { json } from "express";
import dotenv from "dotenv";
// import { er } from "express-async-errors";
import "express-async-errors";

dotenv.config();
// Security Libraries
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";

const app = express();

// Routers
import authrouter from "./routers/auth.js";
import urlRouter from "./routers/url.js";
import tinyUrl from "./routers/tinyUrl.js";

// Error handler
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authentication from "./middleware/authentication.js";

app.use(json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/auth", authrouter);
app.use("/api/v1/shorturl", tinyUrl);
app.use("/api/v1/url", authentication, urlRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the URL Shortener app home page");
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT;
app.listen(port, () => console.log("App started in the port -", port));