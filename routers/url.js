import { Router } from "express";
const urlRouter = Router();
import { getAllUrls, createUrl } from "../controllers/url.js";

urlRouter.route("/").get(getAllUrls).post(createUrl);

export default urlRouter;