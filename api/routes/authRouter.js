const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');

router
    .route('/')
        .post(authController.signin);


module.exports = router;