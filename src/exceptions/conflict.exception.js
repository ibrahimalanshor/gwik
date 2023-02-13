const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function Conflict(errors = {}, message = '') {
  HttpException.call(this, 409, errors, message);
}

extendPrototype(Conflict, HttpException);

module.exports = Conflict;
