const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter your name"],
        minlength: 5,
        maxlength: 50,
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
}, { timestamps: true });

UserSchema.pre("save", async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async(enteredPassword) => {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);