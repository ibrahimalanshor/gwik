const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function UnauthorizedException(errors = {}) {
  HttpException.call(this, 401, 'Unauthorized', errors);
}

extendPrototype(UnauthorizedException, HttpException);

module.exports = UnauthorizedException;
