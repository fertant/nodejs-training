const express = require('express');
const productRoutes = express.Router();
const TokenVerifyService = require('../helpers/tokenVerify.service');
const errors = require('../helpers/errors');
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  database: 'models',
  username: 'postgres',
  password: 'postgres',
  dialect: 'postgres'
});
const Product = require('../models/product')(sequelize, Sequelize);
const uuid = require('uuid/v1');

productRoutes.get('/api/products', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    Product.findAll({where:{}, raw: true})
        .then(results => {
            res.json(results);
        })
        .catch((error) => {
            errors.sendResponseError(res, error);
        });
});

productRoutes.get('/api/products/:uuid', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    let productId = req.params.uuid;
    Product.findAll({where:{uuid: productId}, order: [['reviewId', 'ASC']], raw: true})
        .then(result => {
            res.json(result.pop());
        })
        .catch((error) => {
            errors.sendResponseError(res, error);
        });
});

productRoutes.get('/api/products/:uuid/reviews', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    let productId = req.params.uuid;
    Product.findAll({where:{uuid: productId}, raw: true})
        .then(results => {
            res.json(results);
        })
        .catch((error) => {
            errors.sendResponseError(res, error);
        });
});

productRoutes.post('/api/products', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    let product = req.body;
    if (!product.uuid) {
        product.uuid = uuid();
    }
    if (!product.reviewId) {
        product.reviewId = 1;
    }
    Product.findAll({where:{uuid: product.uuid}, order: [['reviewId', 'ASC']], raw: true})
        .then(existingProduct => {
            if(existingProduct) {
                existingProductLast = existingProduct.pop();
                product.reviewId = parseInt(existingProductLast.reviewId) + 1;
                Product.create(product)
                    .then(result => {
                        res.json(result);
                    });
            }
            else {
                Product.create(product)
                    .then(result => {
                        res.json(result);
                    });
            }
        })
        .catch((error) => {
            errors.sendResponseError(res, error);
        });

});

module.exports = productRoutes;