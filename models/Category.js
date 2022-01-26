const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: String,
    required: [true, "Category name"],
});

module.exports = mongoose.model("Category", CategorySchema);