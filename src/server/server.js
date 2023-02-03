const express = require('express');
const {
  isObject,
  isFunction,
} = require('../../lib/helpers/check-types.helper.js');
const { HttpException } = require('../exceptions');

function Server(config) {
  this.server = express();
  this.httpServer = null;
  this.config = {
    port: 4000,
  };

  this.server.use(express.urlencoded({ extended: true }));
  this.server.use(express.json());

  this.setConfig(config);
}

Server.prototype.setConfig = function (config) {
  if (config && isObject(config)) {
    this.config.port = config.port;
  }
};

Server.prototype.setErrorHandle = function () {
  this.server.use((err, req, res, next) => {
    if (err instanceof HttpException) {
      return res.status(err.status).json({
        status: err.status,
        message: err.message,
        errors: err.errors,
      });
    }

    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  });
};

Server.prototype.listen = function (cb) {
  this.setErrorHandle();

  const port = this.config.port;

  this.httpServer = this.server.listen(port, () => {
    if (cb && isFunction(cb)) {
      cb(port);
    } else {
      console.log(`server listen at ${port}`);
    }
  });
};

Server.prototype.stop = function () {
  this.httpServer.close();
};

Server.prototype.addRoute = function (route) {
  this.server.use(route);
};

module.exports = Server;
