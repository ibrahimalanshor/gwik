const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function NotFound(errors = {}) {
  HttpException.call(this, 404, 'Not Found', errors);
}

extendPrototype(NotFound, HttpException);

module.exports = NotFound;
