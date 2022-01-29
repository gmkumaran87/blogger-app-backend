const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your name"],
        minlength: 5,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: [false, "Please enter your lastname"],
        minlength: 5,
        maxlength: 30,
    },
    email: {
        type: String,
        required: [true, "Please enter your Email Id"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide valid email",
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your Password"],
        minlength: 6,
        maxlength: 12,
    },
    activationCode: {
        type: String,
        required: [true, "Please attach confirmation code"],
    },
    isActive: {
        type: Boolean,
        enum: [true, false],
        default: false,
    },
}, { timestamps: true });

UserSchema.pre("save", async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(enteredPassword) {
    console.log("Password in User", enteredPassword, this.password);
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);