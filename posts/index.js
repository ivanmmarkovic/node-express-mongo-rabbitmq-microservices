
import http from 'http';
import { getPostsToApiChannel, apiToPostsQueue } from './connection.js';
import { createPost, getPostById, getAllPosts, deletePost } from './actions.js';
import mongoose from 'mongoose';

mongoose.connect('mongodb://mongodb:27017/posts?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});


const channel = await getPostsToApiChannel();

channel.consume(apiToPostsQueue, data => {
    channel.ack(data);
    let {uuid, payload, action} = JSON.parse(data.content.toString());
    switch (action) {
        case 'CREATE_POST':
            createPost(uuid, payload.post);
            break;
        case 'GET_POST_BY_ID':
            getPostById(uuid, payload.id);
            break;
        case 'GET_ALL_POSTS':
            getAllPosts(uuid);
            break;
        case 'DELETE_POST':
            deletePost(uuid, payload.id);
        default:
            break;
    }
});

const server = http.createServer(async (req, res) => {});
server.listen(4000, () => console.log('Server posts listens on port 4000'));

