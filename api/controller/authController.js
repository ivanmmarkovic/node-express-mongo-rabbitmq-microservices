
const {signinUtil} = require('../utils');

const signin = async (req, res, next) => {
    try {
        let {status, responseData, errorMessage} = await signinUtil(req.body);
        if(errorMessage != null){
            return res.status(status).json({error: errorMessage});
        }
        return res.status(status).json(responseData);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signin
};
