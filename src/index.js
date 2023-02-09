const Exceptions = require('./exceptions');
const {
  createBodyValidationMiddleware,
  body,
} = require('./middlewares/body-validation/body-validation.middleware');
const {
  createMultipartFormDataMiddleware,
} = require('./middlewares/multipart-form-data/multipart-form-data.middleware');

exports.Server = require('./server/server');
exports.Router = require('./router/router');

exports.BadRequestException = Exceptions.BadRequestException;
exports.ConflictException = Exceptions.ConflictException;
exports.ForbiddenException = Exceptions.ForbiddenException;
exports.HttpException = Exceptions.HttpException;
exports.NotFoundException = Exceptions.NotFoundException;
exports.UnauthorizedException = Exceptions.UnauthorizedException;
exports.UnprocessableEntityException = Exceptions.UnprocessableEntityException;

exports.createBodyValidationMiddleware = createBodyValidationMiddleware;
exports.createMultipartFormDataMiddleware = createMultipartFormDataMiddleware;
exports.body = body;
