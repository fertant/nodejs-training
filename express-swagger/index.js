'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var express = require('express');
var swaggerUi = require('swagger-ui-express');
var TokenVerifyService = require('./utils/tokenVerify.service');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = 8001;

var app = express();
// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development'
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Provide the security handlers
  app.use(middleware.swaggerSecurity({
    Bearer: function (req, def, scopes, callback) {
      TokenVerifyService.verifyAndDecodeToken(req)
        .then(function(decodedToken) {
          req.decodedToken = decodedToken;
          callback(null);
        })
        .catch(function (err) {
          callback(req.res.status(err.statusCode).json(err));
        });
      }
    })
  );
  
  // Validate Swagger requests
  app.use(middleware.swaggerValidator({
    validateResponse: true
  }));

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
});

app.listen(serverPort, function () {
  // eslint-disable-next-line no-console
  console.log('Node HTTP server is listening on port %d', serverPort);
});
