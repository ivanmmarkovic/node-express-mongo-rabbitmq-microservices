const {request, get} = require('http');

const {USERS_MICROSERVICE} = require('./constants');

const getUsersUtil = () => {
    return new Promise((resolve, reject) => {
        let {protocol, host, port} = USERS_MICROSERVICE;
        let req = get(`${protocol}//${host}:${port}/users`, res => {
            res.on('data', data => {
                let {responseData, errorMessage} = JSON.parse(data.toString());
                resolve({status: res.statusCode, responseData, errorMessage});
            });
            res.on('error', error => reject({status: 503, responseData: null, errorMessage: 'Service Unavailable'}));
        });
        req.on('error', error => reject({status: 503, responseData: null, errorMessage: 'Service Unavailable'}));
    });
};

const getUserByIdUtil = (id) => {
    return new Promise((resolve, reject) => {
        let {protocol, host, port} = USERS_MICROSERVICE;
        let req = get(`${protocol}//${host}:${port}/users/${id}`, res => {
            res.on('data', data => {
                let {responseData, errorMessage} = JSON.parse(data.toString());
                resolve({status: res.statusCode, responseData, errorMessage});
            });
            res.on('error', error => reject({status: 503, responseData: null, errorMessage: 'Service Unavailable'}));
        });
        req.on('error', error => reject({status: 503, responseData: null, errorMessage: 'Service Unavailable'}));
    });
};

const createUserUtil = (payload) => {
    return new Promise((resolve, reject) => {
        let {protocol, host, port} = USERS_MICROSERVICE;
        const req = request({
            protocol,
            host,
            port,
            path: '/users',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, res => {
            res.on('data', data => {
                let {responseData, errorMessage} = JSON.parse(data.toString());
                resolve({status: res.statusCode, responseData, errorMessage});
            });
            res.on('error', error => reject({status: 503, responseData: null, errorMessage: 'Service Unavailable'}));
        });
        req.end(JSON.stringify(payload));
        req.on('error', error => reject({status: 503, responseData: null, errorMessage: 'Service Unavailable'}));
    });
};


const deleteUserByIdUtil = (id) => {
    return new Promise((resolve, reject) => {
        let {protocol, host, port} = USERS_MICROSERVICE;
        const req = request({
            protocol,
            host,
            port,
            path: `/users/${id}`,
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        }, res => {
            res.on('data', data => {
                let {responseData, errorMessage} = JSON.parse(data.toString());
                resolve({status: 204, responseData, errorMessage});
            });
            res.on('error', error => reject({status: 503, responseData: null, errorMessage: 'Service Unavailable'}));
        });
        req.end(null);
        req.on('error', error => reject({status: 503, responseData: null, errorMessage: 'Service Unavailable'}));
    });
};

const updateUserByIdUtil = (id, payload) => {
    return new Promise((resolve, reject) => {
        let {protocol, host, port} = USERS_MICROSERVICE;
        const req = request({
            protocol,
            host,
            port,
            path: `/users/${id}`,
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, res => {
            res.on('data', data => {
                let {responseData, errorMessage} = JSON.parse(data.toString());
                resolve({status: res.statusCode, responseData, errorMessage});
            });
            res.on('error', error => reject({status: 503, responseData: null, errorMessage: 'Service Unavailable'}));
        });
        req.end(JSON.stringify(payload));
        req.on('error', error => reject({status: 503, responseData: null, errorMessage: 'Service Unavailable'}));
    });
};

module.exports = {
    getUsersUtil,
    getUserByIdUtil,
    createUserUtil,
    updateUserByIdUtil,
    deleteUserByIdUtil
};