const {v4} = require('uuid');

const e = require('../emitter');

const {getApiToPostsChannel, apiToPostsQueue} = require('../connect');

const createPost = async (req, res, next) => {
    let post = req.body;

    let uuid = v4();
    let action = 'CREATE_POST';

    let channel = await getApiToPostsChannel();
    channel.sendToQueue(apiToPostsQueue, Buffer.from(JSON.stringify({action, payload: {post}, uuid})));

    e.on(uuid, (status, message, payload) => {
        if(message != 'Ok'){
            return res.status(status).json({error: message});
        }
        return res.status(status).json(payload);
    });

};


const getPostById = async (req, res, next) => {
    let {id} = req.params;
    // TODO return if id is not valid
    let uuid = v4();
    let action = 'GET_POST_BY_ID';

    let channel = await getApiToPostsChannel();
    channel.sendToQueue(apiToPostsQueue, Buffer.from(JSON.stringify({action, payload: {id}, uuid})));

    e.on(uuid, (status, message, payload) => {
        if(message != 'Ok'){
            return res.status(status).json({error: message});
        }
        return res.status(status).json(payload);
    });

};


const getAllPosts = async (req, res, next) => {
    let uuid = v4();
    let action = 'GET_ALL_POSTS';

    let channel = await getApiToPostsChannel();
    channel.sendToQueue(apiToPostsQueue, Buffer.from(JSON.stringify({action, payload: null, uuid})));

    e.on(uuid, (status, message, payload) => {
        if(message != 'Ok'){
            return res.status(status).json({error: message});
        }
        return res.status(status).json(payload);
    });

};


const deletePost = async (req, res, next) => {
    let {id} = req.params;
    // TODO return if id is not valid
    let uuid = v4();
    let action = 'DELETE_POST';

    let channel = await getApiToPostsChannel();
    channel.sendToQueue(apiToPostsQueue, Buffer.from(JSON.stringify({action, payload: {id}, uuid})));

    e.on(uuid, (status, message, payload) => {
        if(message != 'Ok'){
            return res.status(status).json({error: message});
        }
        return res.status(status).json(payload);
    });

};

module.exports = {
    createPost,
    getPostById,
    getAllPosts,
    deletePost
};