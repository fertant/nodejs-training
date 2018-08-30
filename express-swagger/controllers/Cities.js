'use strict';

var utils = require('../utils/writer.js');
var Cities = require('../service/CitiesService');

module.exports.deleteCity = function deleteCity (req, res, next) {
  var cityId = req.swagger.params['cityId'].value;
  Cities.deleteCity(cityId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getCities = function getCities (req, res, next) {
  Cities.getCities()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postCity = function postCity (req, res, next) {
  var body = req.swagger.params['body'].value;
  Cities.postCity(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putCity = function putCity (req, res, next) {
  var cityId = req.swagger.params['cityId'].value;
  var body = req.swagger.params['body'].value;
  Cities.putCity(cityId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
