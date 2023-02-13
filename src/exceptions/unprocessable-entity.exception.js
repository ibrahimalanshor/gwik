const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function UnprocessableEntity(errors = {}, message = '') {
  HttpException.call(this, 422, errors, message);
}

extendPrototype(UnprocessableEntity, HttpException);

module.exports = UnprocessableEntity;
