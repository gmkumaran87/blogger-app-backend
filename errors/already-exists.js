import CustomApiError from "./custom-api.js";
import { StatusCodes } from "http-status-codes";

class AccountExistsError extends CustomApiError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.CONFLICT;
    }
}

export default AccountExistsError;