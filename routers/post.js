const express = require("express");
const { auth } = require("google-auth-library");
const {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
    uploadImage,
} = require("../controllers/post");
const authentication = require("../middleware/authentication");

const router = express.Router();

router.route("/").get(getAllPosts).post(authentication, createPost);
router
    .route("/:id")
    .get(getPost)
    .patch(authentication, updatePost)
    .delete(authentication, deletePost);

router.route("/image-upload/").post(authentication, uploadImage);

module.exports = router;