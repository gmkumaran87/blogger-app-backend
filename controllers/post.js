const {
    AccountExistsError,
    BadRequestError,
    UnauthenticatedError,
} = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const Post = require("../models/Post");
const imageUpload = require("../utility/cloudinary");

const createPost = async(req, res) => {
    console.log(req.user);

    req.body.createdBy = req.user.userId;

    const post = await Post.create(req.body);
    res
        .status(StatusCodes.CREATED)
        .json({ msg: "Post created successfully", post });
};

const getAllPosts = async(req, res) => {
    res.send("All Posts");
};

const getPost = async(req, res) => {
    const { postId } = req.params.id;
    res.send("Single Post");
};

const updatePost = async(req, res) => {
    res.send("Updating Posts");
};

const deletePost = async(req, res) => {
    res.send("Deleting post");
};

const uploadImage = async(req, res) => {
    console.log(req.body.image);

    try {
        const result = await imageUpload(req.body.image);
        res.send("Uploading image");
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "Image upload failed" });
    }
};
module.exports = {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
    uploadImage,
};