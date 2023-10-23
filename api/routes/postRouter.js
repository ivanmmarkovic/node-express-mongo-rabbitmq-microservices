
const express = require('express');
const router = express.Router();

const postController = require('../controller/postController');


router
    .route('/')
        .get(postController.getAllPosts)
        .post(postController.createPost);

router
    .route('/:id')
        .get(postController.getPostById)
        .delete(postController.deletePost);


module.exports = router;