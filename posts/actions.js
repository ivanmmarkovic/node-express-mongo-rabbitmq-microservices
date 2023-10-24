
import { getPostsToApiChannel, postsToApiQueue} from './connection.js';

import { Post } from './model.js';
import {handleErrors} from './utils.js';

const channel = await getPostsToApiChannel();

export const createPost = async (uuid, post) => {
    let status, message, payload;
    try {
        let o = await Post.create(post);
        status = 201;
        message = 'Ok';
        payload = {
            post: o
        }
    } catch (error) {
        [status, message] = handleErrors(error);
        payload = null;
    }
    channel.sendToQueue(postsToApiQueue, Buffer.from(JSON.stringify({status, message, payload, uuid})));
};


export const getPostById = async (uuid, id) => {
    let status, message, payload;
    try {
        let o = await Post.findById(id);
        if(o == null){
            throw new Error('Not found');
        }
        status = 200;
        message = 'Ok';
        payload = {
            post: o
        }
    } catch (error) {
        [status, message] = handleErrors(error);
        payload = null;
    }
    channel.sendToQueue(postsToApiQueue, Buffer.from(JSON.stringify({status, message, payload, uuid})));
};

export const getAllPosts = async (uuid) => {
    let status, message, payload;
    try {
        let posts = await Post.find();
        status = 200;
        message = 'Ok';
        payload = {
            posts
        }
    } catch (error) {
        [status, message] = handleErrors(error);
        payload = null;
    }
    channel.sendToQueue(postsToApiQueue, Buffer.from(JSON.stringify({status, message, payload, uuid})));
};

export const deletePost = async (uuid, id) => {
    let status, message, payload;
    try {
        await Post.findByIdAndDelete(id);
        status = 200;
        message = 'Ok';
        payload = null;
    } catch (error) {
        [status, message] = handleErrors(error);
        payload = null;
    }
    channel.sendToQueue(postsToApiQueue, Buffer.from(JSON.stringify({status, message, payload, uuid})));
};

