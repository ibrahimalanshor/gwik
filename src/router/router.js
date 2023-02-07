const express = require('express');
const {
  isFunction,
  isString,
} = require('../../lib/helpers/check-types.helper');

function createMethodHandler(method, defaultStatus, defaultMessage) {
  return function (handler, status) {
    if (!handler || !isFunction(handler))
      throw new Error('Handler argument must be a function');

    this.methods[method] = {
      handle: handler,
      status: status || defaultStatus,
      message: defaultMessage,
    };

    return this;
  };
}

function Router(path) {
  if (!path || !isString(path))
    throw new Error('Path argument must be a string');

  this.router = express.Router();
  this.path = path;

  this.methods = {};
  this.middlewares = [];
}

Router.prototype.build = function () {
  const route = this.router.route(this.path);

  for (const method in this.methods) {
    route[method]([
      this.middlewares,
      async (req, res, next) => {
        try {
          const data = await this.methods[method].handle({
            req,
            res,
            t: req.t,
          });

          return res.status(this.methods[method].status).json({
            status: this.methods[method].status,
            message: this.methods[method].message,
            data,
          });
        } catch (err) {
          next(err);
        }
      },
    ]);
  }

  return this.router;
};

Router.prototype.middleware = function (middlewares) {
  this.middlewares = middlewares;

  return this;
};

Router.prototype.get = createMethodHandler('get', 200, 'Ok');
Router.prototype.post = createMethodHandler('post', 201, 'Created');
Router.prototype.put = createMethodHandler('put', 200, 'Ok');
Router.prototype.patch = createMethodHandler('patch', 200, 'Ok');
Router.prototype.delete = createMethodHandler('delete', 200, 'Ok');

module.exports = Router;
