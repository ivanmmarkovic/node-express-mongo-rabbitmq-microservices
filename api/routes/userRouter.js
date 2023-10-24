
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');
const userController = require('../controller/userController');

router
    .route('/')
        .get(userController.getAllUsers)
        .post(userController.createUser);

router
    .route('/:id')
        .get(userController.getUserById)
        .patch(authMiddleware, userController.updateUserById)
        .delete(authMiddleware, userController.deleteUserById);


module.exports = router;

