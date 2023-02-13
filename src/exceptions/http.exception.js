function HttpException(status = 400, errors = {}, message = '') {
  this.status = status;
  this.message = message;
  this.errors = errors;

  this.rawMessage = false;
}

HttpException.prototype.useRaw = function () {
  this.rawMessage = true;

  return this;
};

module.exports = HttpException;
