'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');

module.exports.auth = function auth (req, res, next) {
  var body = req.swagger.params['body'].value;
  Users.auth(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUsers = function getUsers (req, res, next) {
  Users.getUsers()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.registerUser = function registerUser (req, res, next) {
  var body = req.swagger.params['body'].value;
  Users.registerUser(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
