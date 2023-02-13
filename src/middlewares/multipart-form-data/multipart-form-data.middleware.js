const { BadRequestException } = require('../../exceptions');
const { createStorage } = require('./storage');

function multipartFormDataMiddleware(req, res, next) {
  if (!req.file) {
    throw new BadRequestException({}, 'validation.file-not-exists');
  }

  next();
}

function createMultipartFormDataMiddleware(storageConfig = {}) {
  return [createStorage(storageConfig), multipartFormDataMiddleware];
}

module.exports = { createMultipartFormDataMiddleware };
