const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function BadRequestException(errors = {}) {
  HttpException.call(this, 400, 'Bad Request', errors);
}

extendPrototype(BadRequestException, HttpException);

module.exports = BadRequestException;
