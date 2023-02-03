const express = require('express');
const { isFunction } = require('../../lib/helpers/check-types.helper')

function Router(path) {
  this.router = express.Router();
  this.path = path
}

Router.prototype.getRouter = function () {
  return this.router
}

Router.prototype.get = function (handler) {
  if (!handler || !isFunction(handler)) throw new Error('Handler argument must be a function')

  this.router.get(this.path, (req, res) => {
    return handler()
  })

  return this
}

module.exports = Router;
