const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something Went wrong, please try again later.",
    };
    console.log("In eror handler", err, customError);
    return res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;