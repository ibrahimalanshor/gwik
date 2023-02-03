const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function UnprocessableEntity(errors = {}) {
  HttpException.call(this, 422, 'Unprocessable Entity', errors);
}

extendPrototype(UnprocessableEntity, HttpException);

module.exports = UnprocessableEntity;
