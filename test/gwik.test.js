const { expect } = require('chai');
const { describe, it } = require('mocha');

describe('gwik test', () => {
  const gwik = require('../index');

  it('shoud be defined', () => {
    expect(gwik).not.to.be.undefined;
    expect(gwik).to.be.a('object');
  });

  it('should exports server function constructor', () => {
    expect(gwik).to.have.property('Server');
    expect(gwik.Server).to.be.a('function');
  });

  it('should exports router function constructor', () => {
    expect(gwik).to.have.property('Router');
    expect(gwik.Router).to.be.a('function');
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
      expect(gwik).to.have.property(`${exception}Exception`);
    }
  });

  it('should exports body validation middleware', () => {
    expect(gwik).to.have.property('createBodyValidationMiddleware');
  });

  it('should exports multipart form data middleware', () => {
    expect(gwik).to.have.property('createMultipartFormDataMiddleware');
  });
});
