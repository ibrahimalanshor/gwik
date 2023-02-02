const { expect } = require('chai');
const { describe } = require('mocha');
const Router = require('../../src/router/router');

describe('router test', () => {
  it('should defined and callable', () => {
    expect(Router).to.not.be.undefined;
    expect(Router).to.be.a('function');
  });

  it('should return object', () => {
    expect(Router()).to.be.a('object');
  });

  it('should return base path route from argument', () => {
    expect(Router('/')).to.have.property('basePath');
  });

  it('should have get method and callable', () => {
    const router = Router('/');

    expect(router).to.have.property('get');
    expect(router.get).to.be.a('function');
  });
});
