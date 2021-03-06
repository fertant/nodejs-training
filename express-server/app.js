const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const citiesRoutes = require('./routes/cities');
const passport = require('passport');
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRoutes);
app.use('/', productRoutes);
app.use('/', citiesRoutes);

module.exports = app;
