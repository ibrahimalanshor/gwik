const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function NotFound(errors = {}, message = '') {
  HttpException.call(this, 404, errors, message);
}

extendPrototype(NotFound, HttpException);

module.exports = NotFound;
