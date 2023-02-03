const { BadRequestException } = require('../../exceptions');
const { createStorage } = require('./storage');

function multipartFormDataMiddleware(req, res, next) {
  if (!req.file) {
    throw new BadRequestException();
  }

  next();
}

function createMultipartFormDataMiddleware(storageConfig = {}) {
  return [createStorage(storageConfig), multipartFormDataMiddleware];
}

module.exports = { createMultipartFormDataMiddleware };
