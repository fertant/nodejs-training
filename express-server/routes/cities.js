const express = require('express');
const citiesRoutes = express.Router();
const TokenVerifyService = require('../helpers/tokenVerify.service');
const errors = require('../helpers/errors');
const CitiesModel = require('../models/cities');
const mongoose = require('mongoose');

citiesRoutes.get('/api/cities', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    mongoose.connect('mongodb://admin:admin@localhost:27017/mongodb');
    CitiesModel.find()
        .then(doc => {
            res.json(doc);
            mongoose.disconnect();
        })
        .catch(err => {
            errors.sendResponseError(res, error);
            mongoose.disconnect();
        });
});

citiesRoutes.post('/api/cities', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    mongoose.connect('mongodb://admin:admin@localhost:27017/mongodb');
    let city = req.body;
    let cityModel = new CitiesModel(city);
    cityModel.save()
        .then(doc => {
            res.json(doc);
            mongoose.disconnect();
        })
        .catch(err => {
            errors.sendResponseError(res, error);
            mongoose.disconnect();
        });
});

citiesRoutes.put('/api/cities/:id', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    mongoose.connect('mongodb://admin:admin@localhost:27017/mongodb');
    let cityId = req.params.id;
    let city = req.body;
    CitiesModel.update({ _id: cityId }, { $set: city}).exec()
        .then(doc => {
            res.json(doc);
            mongoose.disconnect();
        })
        .catch(err => {
            errors.sendResponseError(res, error);
            mongoose.disconnect();
        });
});

citiesRoutes.delete('/api/cities/:id', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    mongoose.connect('mongodb://admin:admin@localhost:27017/mongodb');
    let cityId = req.params.id;
    CitiesModel.deleteOne({ _id: cityId })
        .then(doc => {
            res.json(doc);
            mongoose.disconnect();
        })
        .catch(err => {
            errors.sendResponseError(res, error);
            mongoose.disconnect();
        });
});

module.exports = citiesRoutes;