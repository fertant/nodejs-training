const jwt = require('jsonwebtoken');
const errors = require('./errors');
const constants = require('./constants');
var Promise = require('bluebird');

class TokenVerifyService {
  
  generateToken(userId) {
    return jwt.sign({
        'grantType': 'password',
        'requireClientSecretToRefresh': false,
        'sub': 'user:' + userId,
      }, constants.privateKey, {
        algorithm: 'RS256'
      });
  }

  verifyAndDecodeToken(req) {
    let options = {
      algorithms: ['RS256'],
      ignoreExpiration: false
    };
    if (!req.headers.authorization) {
      return Promise.reject(errors.errorAuthenticationNeeded());
    }
    let auth = req.headers.authorization.replace('Bearer ', '');

    return jwt.verify(auth, constants.publicKey, options, function(err, decodedToken) {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return Promise.reject(errors.errorTokenExpired());
        }
        return Promise.reject(errors.errorTokenInvalid());
      } else {
        decodedToken.uuid = decodedToken.sub.replace('user:', '');
        decodedToken.original = auth;
        return Promise.resolve(decodedToken);
      }
    });  
  };

}

module.exports = new TokenVerifyService();
