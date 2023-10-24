
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');
const postController = require('../controller/postController');


router
    .route('/')
        .get(postController.getAllPosts)
        .post(authMiddleware, postController.createPost);

router
    .route('/:id')
        .get(postController.getPostById)
        .delete(authMiddleware, postController.deletePost);


module.exports = router;