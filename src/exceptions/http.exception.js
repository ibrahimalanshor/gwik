function HttpException(status = 400, message = 'Bad Request', errors = {}) {
  this.status = status;
  this.message = message;
  this.errors = errors;
}

module.exports = HttpException;
