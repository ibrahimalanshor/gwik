const { validationResult, matchedData, body } = require('express-validator');
const { UnprocessableEntityException } = require('../../exceptions');

function bodyValidationMiddleware(req, res, next) {
  try {
    validationResult(req).throw();

    req.body = matchedData(req, { locations: ['body'] });

    next();
  } catch (err) {
    next(new UnprocessableEntityException(err.mapped()));
  }
}

function createBodyValidationMiddleware(schema) {
  return [schema, bodyValidationMiddleware];
}

module.exports = {
  body,
  bodyValidationMiddleware,
  createBodyValidationMiddleware,
};
