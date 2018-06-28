const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const uuid = require('uuid/v1');
const _ = require('lodash');
const constants = require('../helpers/constants');
const TokenVerifyService = require('../helpers/tokenVerify.service');
const { promisify } = require('util');
const path = require('path');
const userRoutes = express.Router();
const errors = require('../helpers/errors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, done) {
        let filePath = path.resolve('./express-server/config/creds.txt');
        let readFileAsync = promisify(fs.readFile);
        readFileAsync(filePath, { encoding : 'utf8'})
            .then((content) => {
                creds = JSON.parse(content);
                let user = _.find(creds, ['email', username]);
                if (!user) {
                    return done(null, false, { message: 'User does not exist.' });
                } else if (user.password !== password) {
                    return done(null, false, { message: 'Password not correct, try once more.' });
                } else {
                    return done(null, user);
                }
            })
            .catch((error) => {
                errors.sendResponseError(res, error);
            });
    }
));

userRoutes.get('/api/users', TokenVerifyService.verifyAndDecodeToken, function(req, res) {
    let filePath = path.resolve('./express-server/config/creds.txt');
    let readFileAsync = promisify(fs.readFile);
    readFileAsync(filePath, { encoding : 'utf8'})
        .then((content) => {
            creds = JSON.parse(content);
            res.json({users: creds});
        })
        .catch((error) => {
            errors.sendResponseError(res, error);
        });
});

userRoutes.post('/auth', function(req, res) {
    let params = req.body;
    let readFileAsync = promisify(fs.readFile);
    let filePath = path.resolve('./express-server/config/creds.txt');
    let userCred = null;
    readFileAsync(filePath, { encoding : 'utf8'})
    .then((content) => {
        creds = JSON.parse(content);
        let user = _.find(creds, ['email', params.email]);
        if (!user || user.password !== params.password) {
            let err = Error('Not registered user')
            err.code = 404;
            throw err;
        } else {
            user.token = TokenVerifyService.generateToken(user.uuid);
        }
        userCred = user;

        res.json({
            code: 200,
            message: "OK",
            uuid: userCred.uuid,
            token: userCred.token
        });
    })
    .catch((error) => {
        errors.sendResponseError(res, error);
    });
});

userRoutes.post('/register', function(req, res) {
    let params = req.body;
    let readFileAsync = promisify(fs.readFile);
    let writeFileAsync = promisify(fs.writeFile);
    let filePath = path.resolve('./express-server/config/creds.txt');
    let userCred = null;
    readFileAsync(filePath, { encoding : 'utf8'})
    .then((content) => {
        creds = JSON.parse(content);
        let user = _.find(creds, ['email', params.email]);
        if (!user) {
            user = {
                email: params.email,
                password: params.password
            };
        }
        if (user && !user.uuid) {
            let userId = uuid();
            user.uuid = userId;
        }
        if (user) {
            let index = _.findIndex(creds, {'email': params.email});
            if (index === -1) {
                creds.splice(1, 0, user);
            } else {
                creds.splice(index, 1, user);
            }
        }
        userCred = user;

        return writeFileAsync(filePath, JSON.stringify(creds), { encoding : 'utf8'});
    })
    .then((content) => {
        res.json({
            uuid: userCred.uuid,
        });
    })
    .catch((error) => {
        errors.sendResponseError(res, error);
    });
});

module.exports = userRoutes;