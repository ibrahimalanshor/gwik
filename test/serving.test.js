const { expect } = require('chai');
const { describe, it } = require('mocha');

describe('serving test', () => {
  const serving = require('../index');

  it('shoud be defined', () => {
    expect(serving).not.to.be.undefined;
    expect(serving).to.be.a('object');
  });

  it('should exports server function constructor', () => {
    expect(serving).to.have.property('Server');
    expect(serving.Server).to.be.a('function');
  });

  it('should exports router function constructor', () => {
    expect(serving).to.have.property('Router');
    expect(serving.Router).to.be.a('function');
  });

  it('should exports all exceptions', () => {
    for (const exception of [
      'BadRequest',
      'Conflict',
      'Forbidden',
      'Http',
      'NotFound',
      'Unauthorized',
      'UnprocessableEntity',
    ]) {
      expect(serving).to.have.property(`${exception}Exception`);
    }
  });

  it('should exports body validation middleware', () => {
    expect(serving).to.have.property('createBodyValidationMiddleware');
  });

  it('should exports multipart form data middleware', () => {
    expect(serving).to.have.property('createMultipartFormDataMiddleware');
  });
});
