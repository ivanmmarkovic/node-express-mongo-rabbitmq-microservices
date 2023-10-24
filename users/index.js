const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(express.json());
app.use(cors());

const userController = require('./controller');

mongoose.connect('mongodb://mongodb:27017/users?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

global.jwtKey = "secret"; 
global.jwtExpires = 24 * 60 * 60 * 1000;


app.get('/users', userController.getAllUsers);

app.get('/users/:id', userController.getUserById);

app.post('/users', userController.createUser);

app.patch('/users/:id', userController.patchUserById);

app.delete('/users/:id', userController.deleteUserById);


app.post('/signin', userController.signin);

app.use((err, req, res, next) => { 
    return res.status(500).json({responseData: null, errorMessage: 'Internal server error'});
});


app.listen(3000, () => console.log('Users service running on port 3000'));
