const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const {
    AccountExistsError,
    BadRequestError,
    UnauthenticatedError,
    NotFoundError,
} = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const getCategories = async(req, res) => {
    const category = await Category.find({});

    if (!category) {
        throw new NotFoundError("Categories not found..");
    }
    console.log("Categories", category);
    res.status(StatusCodes.OK).json(category);
};
router.route("/").get(getCategories);

module.exports = router;