const {
    AccountExistsError,
    BadRequestError,
    UnauthenticatedError,
    NotFoundError,
} = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const Post = require("../models/Post");
const imageUpload = require("../utility/cloudinary");
const path = require("path");
const { create } = require("../models/Post");

const createPost = async(req, res) => {
    console.log(req.user);

    req.body.createdBy = req.user.userId;

    const post = await Post.create(req.body);
    res
        .status(StatusCodes.CREATED)
        .json({ msg: "Post created successfully", post });
};

const getAllPosts = async(req, res) => {
    const { author, cat } = req.query;
    const queryObject = {};

    if (author) {
        queryObject.createdBy = author;
    }
    if (cat) {
        queryObject.category = { $in: [cat] };
    }
    console.log("Query obj", queryObject);
    const posts = await Post.find(queryObject);

    res.status(StatusCodes.OK).json(posts);
};

const getPost = async(req, res) => {
    const postId = req.params.id;
    const createdBy = req.user.userId;

    console.log(createdBy);

    const post = await Post.findById({ _id: postId, createdBy });

    if (!post) {
        throw new NotFoundError("Post not found");
    }
    res.status(StatusCodes.OK).json({ msg: "Single Post", post });
};

const updatePost = async(req, res) => {
    const postId = req.params.id;
    const createdBy = req.user.userId;

    const post = await Post.findByIdAndUpdate({ _id: postId, createdBy },
        req.body, { new: true, runValidators: true }
    );

    if (!post) {
        throw new NotFoundError("Post not found");
    }
    res.status(StatusCodes.OK).json(post);
};

const deletePost = async(req, res) => {
    const postId = req.params.id;
    const createdBy = req.user.userId;

    const post = await Post.findByIdAndDelete({ _id: postId, createdBy });

    if (!post) {
        throw new NotFoundError("Post not found");
    }
    res.status(StatusCodes.OK).send("Post deleted");
};

const uploadImage = async(req, res) => {
    const fileName = req.file.destination + "/" + req.file.filename;

    try {
        const result = await imageUpload(fileName);
        res.status(StatusCodes.OK).json({
            msg: "Image uploaded successfully",
            imageUrl: result.secure_url,
        });
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