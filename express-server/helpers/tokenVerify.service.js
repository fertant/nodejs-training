const jwt = require('jsonwebtoken');
const errors = require('../helpers/errors');
const { promisify } = require('util');
const constants = require('../helpers/constants');

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

  verifyAndDecodeToken(req, res, callback) {
    let options = {
      algorithms: ['RS256'],
      ignoreExpiration: false
    };
    if (!req.headers.authorization) {
      throw errors.errorAuthenticationNeeded(res);
    }
    let auth = req.headers.authorization.replace('Bearer ', '');

    jwt.verify(auth, constants.publicKey, options, function(err, decodedToken) {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          throw errors.errorTokenExpired(err);
        }
        throw errors.errorTokenInvalid(err);
      } else {
        decodedToken.uuid = decodedToken.sub.replace('user:', '');
        decodedToken.original = auth;
        req.decodedToken = decodedToken
  
        callback();
      }
    });  
  };

}

module.exports = new TokenVerifyService();
