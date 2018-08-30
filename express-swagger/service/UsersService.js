'use strict';

const fs = require('fs');
const uuid = require('uuid/v1');
const _ = require('lodash');
const TokenVerifyService = require('../utils/tokenVerify.service');
const { promisify } = require('util');
const path = require('path');

/**
 * user authentication
 * User authentication endpoint 
 *
 * body User  (optional)
 * returns inline_response_200
 **/
exports.auth = function(body) {
  let params = body;
  let readFileAsync = promisify(fs.readFile);
  let filePath = path.resolve('./express-swagger/config/creds.txt');
  let userCred = null;
  return readFileAsync(filePath, { encoding : 'utf8'})
    .then((content) => {
      let creds = JSON.parse(content);
      let user = _.find(creds, ['email', params.email]);
      if (!user || user.password !== params.password) {
          let err = Error('Not registered user')
          err.code = 404;
          throw err;
      } else {
          user.token = TokenVerifyService.generateToken(user.uuid);
      }
      userCred = user;

      return {
          code: 200,
          message: "OK",
          uuid: userCred.uuid,
          token: userCred.token
      };
    });
}


/**
 * list of users
 * Get list of all users 
 *
 * returns List
 **/
exports.getUsers = function() {
  let filePath = path.resolve('./express-swagger/config/creds.txt');
  let readFileAsync = promisify(fs.readFile);
  return readFileAsync(filePath, { encoding : 'utf8'})
      .then((content) => {
          let creds = JSON.parse(content);
          return JSON.stringify(creds);
      })
}


/**
 * User register
 * Create new user 
 *
 * body User  (optional)
 * returns User
 **/
exports.registerUser = function(body) {
  let params = body;
  let readFileAsync = promisify(fs.readFile);
  let writeFileAsync = promisify(fs.writeFile);
  let filePath = path.resolve('./express-server/config/creds.txt');
  let userCred = null;
  return readFileAsync(filePath, { encoding : 'utf8'})
    .then((content) => {
      let creds = JSON.parse(content);
      let user = _.find(creds, ['email', params.email]);
      if (!user) {
          user = {
              email: params.email,
              password: params.password
          };
      }
      if (user && !user.uuid) {
          let userId = uuid();
          user.uuid = userId;
      }
      if (user) {
          let index = _.findIndex(creds, {'email': params.email});
          if (index === -1) {
              creds.splice(1, 0, user);
          } else {
              creds.splice(index, 1, user);
          }
      }
      userCred = user;

      return writeFileAsync(filePath, JSON.stringify(creds), { encoding : 'utf8'});
    })
    .then((content) => {
      userCred.token = TokenVerifyService.generateToken(userCred.uuid);
      return userCred;
    });
}

