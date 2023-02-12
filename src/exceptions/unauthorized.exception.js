const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function UnauthorizedException(errors = {}, message = '') {
  HttpException.call(this, 401, errors, message);
}

extendPrototype(UnauthorizedException, HttpException);

module.exports = UnauthorizedException;
