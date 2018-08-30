const _ = require('lodash');

function sendResponseError(res, error) {
    let req = res.req;
    try {
        let errorMessage = {};
        if (typeof error === 'object') {
            errorMessage = error.error || error;
        } else {
            errorMessage = JSON.parse(error).error;
        }
        if (typeof errorMessage !== 'object') {
            errorMessage = JSON.parse(errorMessage);
        }
        if (!errorMessage.message) {
            errorMessage.message = errorMessage.error || error.message;
        }
        errorMessage.code = error.statusCode || error.code || 500;
        errorMessage = _.pick(errorMessage, 'code', 'message');
        res.status(errorMessage.code).json(errorMessage);
    } catch (ex) {
        res.status(500).json(error);
    }
}

function errorAuthenticationNeeded(res) {
    let err = Error('Authorization header missing');
    err.code = 401;

    return sendResponseError(res, err);
}

function errorTokenExpired(res) {
    let err = Error('Token expired');
    err.code = 401;

    return sendResponseError(res, err);
}

function errorTokenInvalid(res) {
    let err = Error('Invalid token');
    err.code = 401;
    
    return sendResponseError(res, err);
}

module.exports.sendResponseError = sendResponseError;
module.exports.errorAuthenticationNeeded = errorAuthenticationNeeded;
module.exports.errorTokenExpired = errorTokenExpired;
module.exports.errorTokenInvalid = errorTokenInvalid;
