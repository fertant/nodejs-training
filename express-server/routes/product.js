const express = require('express');
const productRoutes = express.Router();
const TokenVerifyService = require('../helpers/tokenVerify.service');

productRoutes.get('/api/products', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    res.json({action: 'Return ALL products'});
});

productRoutes.get('/api/products/:id', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    res.json({action: 'Return SINGLE product id = ' + req.params.id});
});

productRoutes.get('/api/products/:id/reviews', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    res.json({action: 'Return ALL reviews for a single product id = ' + req.params.id});
});

productRoutes.post('/api/products', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    res.json({action: 'Add NEW product and return it'});
});

module.exports = productRoutes;