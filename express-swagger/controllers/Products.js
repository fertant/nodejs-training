'use strict';

var utils = require('../utils/writer.js');
var Products = require('../service/ProductsService');

module.exports.getProductById = function getProductById (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  Products.getProductById(uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProductReviews = function getProductReviews (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  Products.getProductReviews(uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProducts = function getProducts (req, res, next) {
  Products.getProducts()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postProduct = function postProduct (req, res, next) {
  var body = req.swagger.params['body'].value;
  Products.postProduct(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
