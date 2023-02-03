const express = require('express');
const {
  isFunction,
  isString,
} = require('../../lib/helpers/check-types.helper');

function createMethodHandler(method, defaultStatus) {
  return function (handler, status) {
    if (!handler || !isFunction(handler))
      throw new Error('Handler argument must be a function');

    this.methods[method] = {
      handle: handler,
      status: status || defaultStatus,
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
}

Router.prototype.build = function () {
  const route = this.router.route(this.path);

  for (const method in this.methods) {
    route[method](async (req, res) => {
      const data = await method.handle({ req, res });

      return res.status(method.status).json({
        status: method.status,
        data,
      });
    });
  }

  return this.router;
};

Router.prototype.get = createMethodHandler('get', 200);
Router.prototype.post = createMethodHandler('post', 201);
Router.prototype.put = createMethodHandler('put', 200);
Router.prototype.patch = createMethodHandler('patch', 200);
Router.prototype.delete = createMethodHandler('delete', 200);

module.exports = Router;
