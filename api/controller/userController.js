
const { getUsersUtil, createUserUtil, getUserByIdUtil, updateUserByIdUtil, deleteUserByIdUtil } = require('../utils');
const {getClient, cacheEx} = require('../redisUtil');


const getUserById = async (req, res, next) => {
    let {id} = req.params;
    if(!id){
        return res.status(400).json({errorMessage: 'Bad request'});
    }
    let redisClient = getClient();
    let userCache = await redisClient.get(id);
    if(userCache){
        return res.status(200).json(JSON.parse(userCache)); 
    }
    try {
        let {status, responseData, errorMessage} = await getUserByIdUtil(id);
        if(errorMessage != null){
            return res.status(status).json({error: errorMessage});
        }
        await redisClient.set(id, JSON.stringify(
            Object.assign({}, {cached: true}, {responseData})
        ), 'EX', cacheEx);
        return res.status(status).json(responseData);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        let {status, responseData, errorMessage} = await createUserUtil(req.body);
        if(errorMessage != null){
            return res.status(status).json({error: errorMessage});
        }
        let redisClient = getClient();
        await redisClient.set(responseData.id, JSON.stringify(
            Object.assign({}, {cached: true}, {responseData})
        ), 'EX', cacheEx);
        return res.status(status).json(responseData);
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    let redisClient = getClient();
    let usersCache = await redisClient.get('users');
    if(usersCache){
        return res.status(200).json(JSON.parse(usersCache)); 
    }
    try {
        let {status, responseData, errorMessage} = await getUsersUtil();
        if(errorMessage != null){
            return res.status(status).json({error: errorMessage});
        }
        await redisClient.set('users', JSON.stringify(
            Object.assign({}, {cached: true}, {responseData})
        ), 'EX', cacheEx);
        return res.status(status).json(responseData);  
    } catch (error) {
        next(error);
    }
};

const updateUserById = async (req, res, next) => {
    let {id} = req.params;
    let {currentUserId} = req.user.id;
    if(id != currentUserId){
        return res.status(403).json({errorMessage: 'Forbidden'});
    }
    if(!id){
        return res.status(400).json({errorMessage: 'Bad request'});
    }
    try {
        let {status, responseData, errorMessage} = await updateUserByIdUtil(id, req.body);
        if(errorMessage != null){
            return res.status(status).json({error: errorMessage});
        }
        let redisClient = getClient();
        await redisClient.set(id, JSON.stringify(
            Object.assign({}, {cached: true}, {responseData})
        ), 'EX', cacheEx);
        return res.status(status).json(responseData);
    } catch (error) {
        next(error);
    }
};

const deleteUserById = async (req, res, next) => {
    let {id} = req.params;
    let {currentUserId} = req.user.id;
    if(id != currentUserId){
        return res.status(403).json({errorMessage: 'Forbidden'});
    }
    if(!id){
        return res.status(400).json({errorMessage: 'Bad request'});
    }
    try {
        let {status, responseData, errorMessage} = await deleteUserByIdUtil(id);
        console.log(status, responseData, errorMessage);
        if(errorMessage != null){
            return res.status(status).json({error: errorMessage});
        }
        let redisClient = getClient(id);
        await redisClient.delete(id);
        return res.status(status).json(responseData);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getUserById,
    createUser,
    getAllUsers,
    updateUserById,
    deleteUserById
};