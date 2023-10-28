const express = require('express');
const app = express();

const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const limiter = require('./rateLimiter');

global.jwtKey = "secret"; 
global.jwtExpires = 24 * 60 * 60 * 1000;

app.use(express.json());
app.use(limiter);
app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/signin', authRouter);

app.get('/', async (req, res, next) => {
    return res.json({ message: 'Hi' });
});

app.use((err, req, res, next) => { 
    return res.status(500).json({errorMessage: 'Internal server error'});
});

app.listen(8080, () => console.log('API Gateway is listening'));