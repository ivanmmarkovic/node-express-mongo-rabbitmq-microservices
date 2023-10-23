
const bcrypt = require('bcrypt');

const UserModel = require('./model');


const createUser = async (req, res, next) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        let user = await UserModel.create(req.body);
        return res.status(201).json({responseData: user, errorMessage: null});  
    } catch (error) {
        if(error.message.indexOf('dup key') != -1){
            let key = error.message.substring(error.message.lastIndexOf('{') + 1, error.message.lastIndexOf(':')).trim();
            return res.status(400).json({responseData: null, errorMessage: `Duplicate key ${key}`});
        }
        if(error.message.indexOf('required') != -1){
            let key = error.message.substring(error.message.indexOf('`') + 1, error.message.lastIndexOf('`'));
            return res.status(400).json({responseData: null, errorMessage: `Required field ${key}`});
        }
        next(error);
    }
};


const getAllUsers = async (req, res, next) => {
    try {
        let users = await UserModel.find({});
        return res.status(200).json({responseData: users, errorMessage: null});
    } catch (error) {
        next(error);
    }
};


const getUserById = async (req, res, next) => {
    try {
        let {id} = req.params;
        let user = await UserModel.findById(id);
        return res.status(200).json({responseData: user, errorMessage: null});
    } catch (error) {
        if(error.message.indexOf('Cast to ObjectId failed') != -1){
            return res.status(404).json({responseData: null, errorMessage: `Not found`});
        }
        next(error);
    }
};


const patchUserById = async (req, res, next) => {
    try {
        let {id} = req.params;
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        let user = await UserModel.findByIdAndUpdate(id, req.body, {new: true});
        return res.status(200).json({responseData: user, errorMessage: null});
    } catch (error) {
        if(error.message.indexOf('Cast to ObjectId failed') != -1){
            return res.status(404).json({responseData: null, errorMessage: `Not found`});
        }
        if(error.message.indexOf('dup key') != -1){
            let key = error.message.substring(error.message.lastIndexOf('{') + 1, error.message.lastIndexOf(':')).trim();
            return res.status(400).json({responseData: null, errorMessage: `Duplicate key ${key}`});
        }
        next(error);
    }
};

const deleteUserById = async (req, res, next) => {
    try {
        let {id} = req.params;
        await UserModel.findByIdAndDelete(id);
        return res.status(200).json({responseData: null, errorMessage: null});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    patchUserById,
    deleteUserById
}