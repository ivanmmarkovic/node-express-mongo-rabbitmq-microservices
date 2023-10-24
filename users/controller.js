
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('./model');
const { handleErrors } = require('./utils');


const createUser = async (req, res, next) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        let user = await UserModel.create(req.body);
        return res.status(201).json({responseData: user, errorMessage: null});  
    } catch (error) {
        let [status, message] = handleErrors(error);
        if(status && message){
            return res.status(status).json({responseData: null, errorMessage: message});
        }
        next(error);
    }
};


const getAllUsers = async (req, res, next) => {
    try {
        let users = await UserModel.find({});
        return res.status(200).json({responseData: users, errorMessage: null});
    } catch (error) {
        let [status, message] = handleErrors(error);
        if(status && message){
            return res.status(status).json({responseData: null, errorMessage: message});
        }
        next(error);
    }
};


const getUserById = async (req, res, next) => {
    try {
        let {id} = req.params;
        let user = await UserModel.findById(id);
        if(user == null){
            throw new Error('Not found');
        }
        return res.status(200).json({responseData: user, errorMessage: null});
    } catch (error) {
        let [status, message] = handleErrors(error);
        if(status && message){
            return res.status(status).json({responseData: null, errorMessage: message});
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
        console.log(user);
        return res.status(200).json({responseData: user, errorMessage: null});
    } catch (error) {
        let [status, message] = handleErrors(error);
        if(status && message){
            return res.status(status).json({responseData: null, errorMessage: message});
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
        let [status, message] = handleErrors(error);
        if(status && message){
            return res.status(status).json({responseData: null, errorMessage: message});
        }
        next(error);
    }
};

const signin = async (req, res, next) => {
    try {
        let {email, password} = req.body;
        let user = await UserModel.findOne({email});
        if(user == null){
            return res.status(404).json({responseData: null, errorMessage: 'User not found'});
        }
        let matches = await bcrypt.compare(password, user.password);
        if(!matches){
            return res.status(400).json({message: 'Invalid password'});
        }
        console.log('------------------------------------------', matches);
        let token = jwt.sign({name: user.name, id: user._id}, global.jwtKey, {
            algorithm: "HS256",
            expiresIn: global.jwtExpires
        });
        return res.status(200).json({responseData: token, errorMessage: null});
    } catch (error) {
        console.log('??????????????????????????????????',error.message);
        next(error);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    patchUserById,
    deleteUserById,
    signin
}