const express = require('express');
const app = express();
const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');

app.use(express.json());
app.use('/posts', postRouter);
app.use('/users', userRouter);

app.get('/', async (req, res, next) => {
    return res.json({ message: 'Hi' });
});



app.use((err, req, res, next) => { 
    return res.status(500).json({errorMessage: 'Internal server error'});
});

app.listen(8080, () => console.log('API Gateway is listening'));