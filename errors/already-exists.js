const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./custom-api");

class AccountExistsError extends CustomApiError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.CONFLICT;
    }
}

module.exports = AccountExistsError;