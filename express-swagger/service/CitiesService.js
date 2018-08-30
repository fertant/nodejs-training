'use strict';

const CitiesModel = require('../models/cities');
const mongoose = require('mongoose');

/**
 * delete existing city
 * By passing in the appropriate options, you can search for available inventory in the system 
 *
 * cityId String id of existing city object
 * returns City
 **/
exports.deleteCity = function(cityId) {
  mongoose.connect('mongodb://admin:admin@localhost:27017/mongodb');
  return CitiesModel.deleteOne({ _id: cityId })
      .then(doc => {
        mongoose.disconnect();
        return {
          code: 200,
          message: "City have been deleted."
        };
      });
}

/**
 * Get list of cities
 * Return list of all reistered cities. 
 *
 * returns List
 **/
exports.getCities = function() {
  mongoose.connect('mongodb://admin:admin@localhost:27017/mongodb');
  return CitiesModel.find()
      .then(doc => {
        mongoose.disconnect();
        return doc;
      });
}

/**
 * create new city
 * Create new city object. 
 *
 * body City  (optional)
 * returns City
 **/
exports.postCity = function(body) {
  mongoose.connect('mongodb://admin:admin@localhost:27017/mongodb');
  let city = body;
  let cityModel = new CitiesModel(city);
  return cityModel.save()
      .then(doc => {
        mongoose.disconnect();
        return doc;
      });
}

/**
 * searches inventory
 * By passing in the appropriate options, you can search for available inventory in the system 
 *
 * cityId String id of existing city object
 * body City update city object (optional)
 * returns City
 **/
exports.putCity = function(cityId, body) {
  mongoose.connect('mongodb://admin:admin@localhost:27017/mongodb');
  let city = body;
  return CitiesModel.update({ _id: cityId }, { $set: city}).exec()
      .then(doc => {
        mongoose.disconnect();
        return {
          code: 200,
          message: "City have been updated."
        };
      });
}

