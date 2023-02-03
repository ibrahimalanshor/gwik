const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function Forbidden(errors = {}) {
  HttpException.call(this, 403, 'Forbidden', errors);
}

extendPrototype(Forbidden, HttpException);

module.exports = Forbidden;
