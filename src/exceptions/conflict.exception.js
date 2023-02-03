const HttpException = require('./http.exception');
const {
  extendPrototype,
} = require('../../lib/helpers/extend-prototype.helper');

function Conflict(errors = {}) {
  HttpException.call(this, 409, 'Conflict', errors);
}

extendPrototype(Conflict, HttpException);

module.exports = Conflict;
