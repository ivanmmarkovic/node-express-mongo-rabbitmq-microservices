
const { getUsersUtil, createUserUtil, getUserByIdUtil, updateUserByIdUtil, deleteUserByIdUtil } = require('../utils');

const getUserById = async (req, res, next) => {
    let {id} = req.params;
    if(!id){
        return res.status(400).json({errorMessage: 'Bad request'});
    }
    try {
        let {status, responseData, errorMessage} = await getUserByIdUtil(id);
        if(errorMessage != null){
            return res.status(status).json({error: errorMessage});
        }
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
        return res.status(status).json(responseData);
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        let {status, responseData, errorMessage} = await getUsersUtil();
        if(errorMessage != null){
            return res.status(status).json({error: errorMessage});
        }
        return res.status(status).json(responseData);  
    } catch (error) {
        next(error);
    }
};

const updateUserById = async (req, res, next) => {
    let {id} = req.params;
    if(!id){
        return res.status(400).json({errorMessage: 'Bad request'});
    }
    try {
        let {status, responseData, errorMessage} = await updateUserByIdUtil(id, req.body);
        if(errorMessage != null){
            return res.status(status).json({error: errorMessage});
        }
        return res.status(status).json(responseData);
    } catch (error) {
        next(error);
    }
};

const deleteUserById = async (req, res, next) => {
    let {id} = req.params;
    if(!id){
        return res.status(400).json({errorMessage: 'Bad request'});
    }
    try {
        let {status, responseData, errorMessage} = await deleteUserByIdUtil(id);
        console.log(status, responseData, errorMessage);
        if(errorMessage != null){
            return res.status(status).json({error: errorMessage});
        }
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