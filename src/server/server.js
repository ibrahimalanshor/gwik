const express = require('express');
const {
  isObject,
  isFunction,
} = require('../../lib/helpers/check-types.helper.js');

function Server(config) {
  this.server = express();
  this.httpServer = null;
  this.config = {
    port: 4000,
  };

  this.setConfig(config);
}

Server.prototype.setConfig = function (config) {
  if (config && isObject(config)) {
    this.config.port = config.port;
  }
};

Server.prototype.listen = function (cb) {
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

module.exports = Server;
