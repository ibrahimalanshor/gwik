const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function BadRequestException(errors = {}, message = '') {
  HttpException.call(this, 400, errors, message);
}

extendPrototype(BadRequestException, HttpException);

module.exports = BadRequestException;
