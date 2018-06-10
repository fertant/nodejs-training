const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const productRoutes  = require('./routes/product');
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.use('/', userRoutes);
app.use('/', productRoutes);

module.exports = app;
