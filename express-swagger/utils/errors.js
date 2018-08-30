const _ = require('lodash');
var utils = require('../utils/writer.js');

function sendResponseError(res, error) {
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
        utils.writeJson(res, errorMessage);
    } catch (ex) {
        utils.writeJson(res, {
            code: 500,
            message: error
          });
    }
}

/**
 * No token provided.
 * @param {Error} error An error
 * @returns {Error} error object
 */
function errorAuthenticationNeeded() {

    return {
        statusCode: 401,
        code: 401,
        error: 'Authorization header missing',
    };
}


/**
 * Provided token expired.
 * @returns {TokenExpiredError} error object
 */
function errorTokenExpired() {

    return {
        statusCode: 401,
        code: 401,
        error: 'Token expired'
    };
}

/**
 * Provided token invalid.
 * @returns {TokenExpiredError} error object
 */
function errorTokenInvalid() {

    return {
        statusCode: 401,
        code: 401,
        error: 'Invalid token'
    };
}


module.exports.sendResponseError = sendResponseError;
module.exports.errorAuthenticationNeeded = errorAuthenticationNeeded;
module.exports.errorTokenExpired = errorTokenExpired;
module.exports.errorTokenInvalid = errorTokenInvalid;
