const express = require('express');
const productRoutes = express.Router();

productRoutes.get('/api/products', function(req, res) {
    res.json({action: 'Return ALL products'});
});

productRoutes.get('/api/products/:id', function(req, res) {
    res.json({action: 'Return SINGLE product id = ' + req.params.id});
});

productRoutes.get('/api/products/:id/reviews', function(req, res) {
    res.json({action: 'Return ALL reviews for a single product id = ' + req.params.id});
});

productRoutes.post('/api/products', function(req, res) {
    res.json({action: 'Add NEW product and return it'});
});

module.exports = productRoutes;