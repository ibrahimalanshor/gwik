const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function Forbidden(errors = {}, message = '') {
  HttpException.call(this, 403, errors, message);
}

extendPrototype(Forbidden, HttpException);

module.exports = Forbidden;
