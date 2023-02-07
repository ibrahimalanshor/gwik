const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const T9n = require('t9n');
const {
  isObject,
  isFunction,
} = require('../../lib/helpers/check-types.helper.js');
const { HttpException } = require('../exceptions');
const { t9nMiddleware } = require('../middlewares/t9n/t9n.middleware');

function Server(config) {
  this.server = express();
  this.httpServer = null;
  this.config = {
    port: 4000,
    logging: true,
    middleware: {
      cors: {},
      helmet: {},
      morgan: {
        format: 'tiny',
        options: {},
      },
    },
    t9n: {
      locale: 'en',
      fallbackLocale: 'en',
      messages: {},
    },
  };

  this.setConfig(config);
  this.setT9n();
  this.setMiddleware();
}

Server.prototype.setConfig = function (config) {
  if (config && isObject(config)) {
    this.config.port = config.port || this.config.port;
    this.config.logging = !!config.logging ?? this.config.logging;

    this.config.middleware.cors = config.cors || this.config.middleware.cors;
    this.config.middleware.helmet =
      config.helmet || this.config.middleware.helmet;
    this.config.middleware.morgan =
      config.morgan || this.config.middleware.morgan;

    if (isObject(config.t9n)) {
      this.config.t9n.locale = config.t9n.locale || this.config.t9n.locale;
      this.config.t9n.fallbackLocale =
        config.t9n.fallbackLocale || this.config.t9n.fallbackLocale;
      this.config.t9n.messages =
        config.t9n.messages || this.config.t9n.messages;
    }
  }
};

Server.prototype.setT9n = function () {
  const t9n = new T9n({
    locale: this.config.t9n.locale,
    fallbackLocale: this.config.t9n.fallbackLocale,
    messages: this.config.t9n.messages,
  });

  this.server.set('t9n', t9n);
};

Server.prototype.setMiddleware = function () {
  this.server.use(express.urlencoded({ extended: true }));
  this.server.use(express.json());

  this.server.use(cors(this.config.middleware.cors));
  this.server.use(helmet(this.config.middleware.helmet));

  if (this.config.logging) {
    this.server.use(
      morgan(
        this.config.middleware.morgan.format,
        this.config.middleware.morgan.options
      )
    );
  }

  this.server.use(t9nMiddleware);
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

    if (this.config.logging) {
      console.log(err);
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
    if (this.config.logging) {
      if (cb && isFunction(cb)) {
        cb(port);
      } else {
        console.log(`server listen at ${port}`);
      }
    }
  });
};

Server.prototype.stop = function () {
  this.httpServer.close();
};

Server.prototype.addRoute = function (route) {
  if (Array.isArray(route)) {
    route.forEach((item) => {
      this.server.use(item);
    });
  } else {
    this.server.use(route);
  }
};

Server.prototype.addStaticRoute = function (path, rootDir) {
  this.server.use(path, express.static(rootDir));
};

module.exports = Server;
