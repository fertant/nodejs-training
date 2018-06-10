const express = require('express');
const userRoutes = express.Router();

userRoutes.get('/api/users', function(req, res) {
    res.json({action: 'Return ALL users'});
});

module.exports = userRoutes;