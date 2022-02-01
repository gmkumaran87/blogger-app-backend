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
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
    destination: "./images",
    filename: (req, file, cb) => {
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
}).single("myImage");

router.route("/").get(getAllPosts).post(authentication, createPost);
router
    .route("/:id")
    .get(getPost)
    .patch(authentication, updatePost)
    .delete(authentication, deletePost);

router.route("/image-upload/").post(authentication, upload, uploadImage);

module.exports = router;