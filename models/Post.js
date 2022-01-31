const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    author: {
        type: String,
        required: [true, "Users first name"],
    },
    title: {
        type: String,
        required: [true, "Please enter the title"],
        minlength: 5,
        maxlength: 30,
    },
    description: {
        type: String,
        required: [true, "Enter your post"],
    },
    image: {
        type: String,
        required: [false, "Post image"],
    },
    categories: {
        type: Array,
        required: [false, "Category of the Posts"],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide the User"],
    },
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);