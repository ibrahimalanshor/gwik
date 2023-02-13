const { validationResult, matchedData, body } = require('express-validator');
const { UnprocessableEntityException } = require('../../exceptions');

function bodyValidationMiddleware(req, res, next) {
  try {
    validationResult(req).throw();

    req.body = matchedData(req, { locations: ['body'] });

    next();
  } catch (err) {
    next(
      new UnprocessableEntityException(
        Object.fromEntries(
          Object.entries(err.mapped()).map(([path, error]) => [
            path,
            {
              ...error,
              msg: req.t.translate(error.msg, { field: error.param }),
            },
          ])
        )
      )
    );
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
