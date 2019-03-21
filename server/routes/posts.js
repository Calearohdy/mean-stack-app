const express = require('express');
const router = express.Router();
const PostController = require('../controller/post');
const authGuard = require('../middleware/checkAuth');
const extractFile = require('../middleware/fileCheck');

router.get('', PostController.getAllPosts);

router.post('', authGuard, extractFile, PostController.createNewPost)

router.put("/:id", authGuard, extractFile, PostController.updatePost)

router.get("/:id", PostController.getPostById)

router.delete("/:id", authGuard, PostController.deletePost);

module.exports = router;