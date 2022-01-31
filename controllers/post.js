const {
    AccountExistsError,
    BadRequestError,
    UnauthenticatedError,
    NotFoundError,
} = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const Post = require("../models/Post");
const Category = require("../models/Category");
const imageUpload = require("../utility/cloudinary");
const path = require("path");

const createPost = async(req, res) => {
    console.log(req.user, req.body);

    const { categories } = req.body;

    req.body.createdBy = req.user.userId;
    req.body.author = req.user.firstName;

    const post = await Post.create(req.body);

    const category = await Category.findOne({ name: categories });

    if (!category) {
        const entry = await Category.create({ name: categories });
    }
    res
        .status(StatusCodes.CREATED)
        .json({ msg: "Post created successfully", post });
};

const getAllPosts = async(req, res) => {
    const { author, categories } = req.query;
    const queryObject = {};

    if (author) {
        queryObject.createdBy = author;
    }
    if (categories) {
        queryObject.categories = { $in: [categories] };
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
    res.status(StatusCodes.OK).json(post);
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
    console.log("Inside upload", req.file);
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