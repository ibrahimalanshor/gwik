const { expect } = require('chai');
const { describe } = require('mocha');
const Router = require('../../src/router/router');

describe('router test', () => {
  it('should defined and callable', () => {
    expect(Router).to.not.be.undefined;
    expect(Router).to.be.a('function');
  });

  it('should return base path route from argument', () => {
    expect(new Router('/')).to.have.property('path');
  });

  it('should have getRouter method, callable and return express router', () => {
    const router = new Router('/')

    expect(router).to.have.property('getRouter')
    expect(router.getRouter).to.be.a('function')
  })

  it('should have get method and callable', () => {
    const router = new Router('/');

    expect(router).to.have.property('get');
    expect(router.get).to.be.a('function');

    expect(router.get(() => 'test')).to.equal(router)

    const createdRoute = router.getRouter().stack.find(stack => stack.route.path === router.path)
    
    expect(createdRoute).to.be.exist
    expect(createdRoute.route.path).to.equal(router.path)
    expect(createdRoute.route.methods.get).to.be.true
  });
});
