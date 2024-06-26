const {v4} = require('uuid');
const {getClient, cacheEx} = require('../redisUtil');
const e = require('../emitter');

const {getApiToPostsChannel, apiToPostsQueue} = require('../connect');

const createPost = async (req, res, next) => {
    let post = req.body;
    let userId = req.user.id;
    post.userId = userId;

    let uuid = v4();
    let action = 'CREATE_POST';

    let channel = await getApiToPostsChannel();
    channel.sendToQueue(apiToPostsQueue, Buffer.from(JSON.stringify({action, payload: {post}, uuid})));

    e.on(uuid, (status, message, payload) => {
        if(message != 'Ok'){
            return res.status(status).json({error: message});
        }
        let redisClient = getClient();
        redisClient.set(payload.id, JSON.stringify(payload.post), 'EX', cacheEx);
        return res.status(status).json(payload);
    });

};


const getPostById = async (req, res, next) => {
    let {id} = req.params;
    let redisClient = getClient();
    let postCache = await redisClient.get(id);
    if(postCache){
        return res.status(200).json(JSON.parse(postCache)); 
    }
    let uuid = v4();
    let action = 'GET_POST_BY_ID';

    let channel = await getApiToPostsChannel();
    channel.sendToQueue(apiToPostsQueue, Buffer.from(JSON.stringify({action, payload: {id}, uuid})));

    e.on(uuid, (status, message, payload) => {
        if(message != 'Ok'){
            return res.status(status).json({error: message});
        }
        redisClient.set(id, JSON.stringify(payload.post), 'EX', cacheEx);
        return res.status(status).json(payload.post);
    });

};


const getAllPosts = async (req, res, next) => {
    let redisClient = getClient();
    /*
    let postsCache = await redisClient.get('posts');
    if(postsCache){
        return res.status(200).json(JSON.parse(postsCache)); 
    }
    */
    let uuid = v4();
    let action = 'GET_ALL_POSTS';

    let channel = await getApiToPostsChannel();
    channel.sendToQueue(apiToPostsQueue, Buffer.from(JSON.stringify({action, payload: null, uuid})));

    e.on(uuid, (status, message, payload) => {
        if(message != 'Ok'){
            return res.status(status).json({error: message});
        }
        // redisClient.set('posts', JSON.stringify(payload.posts), 'EX', cacheEx);
        return res.status(status).json(payload.posts);
    });

};


const deletePost = async (req, res, next) => {
    let {id} = req.params;
    let currentUserId = req.user.id;
    let uuid = v4();
    let action = 'DELETE_POST';

    let channel = await getApiToPostsChannel();
    channel.sendToQueue(apiToPostsQueue, Buffer.from(JSON.stringify({action, payload: {id, currentUserId}, uuid})));

    e.on(uuid, (status, message, payload) => {
        if(message != 'Ok'){
            return res.status(status).json({error: message});
        }
        let redisClient = getClient();
        redisClient.set(id, JSON.stringify({}), 'EX', 10);
        return res.status(status).json(payload);
    });

};

module.exports = {
    createPost,
    getPostById,
    getAllPosts,
    deletePost
};