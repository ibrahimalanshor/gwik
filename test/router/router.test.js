const { expect } = require('chai');
const { describe } = require('mocha');
const Router = require('../../src/router/router');

describe('router test', () => {
  const router = new Router('/');

  it('should defined and callable', () => {
    expect(Router).to.not.be.undefined;
    expect(Router).to.be.a('function');
  });

  it('should return base path route from argument', () => {
    expect(router).to.have.property('path');
  });

  it('should have build method, callable and return express router', () => {
    expect(router).to.have.property('build');
    expect(router.build).to.be.a('function');
  });

  it('should have get method and callable', () => {
    expect(router).to.have.property('get');
    expect(router.get).to.be.a('function');

    expect(router.get(() => 'test')).to.equal(router);
  });

  it('should have post method and callable', () => {
    expect(router).to.have.property('post');
    expect(router.post).to.be.a('function');

    expect(router.post(() => 'test')).to.equal(router);
  });

  it('should have put method and callable', () => {
    expect(router).to.have.property('put');
    expect(router.put).to.be.a('function');

    expect(router.put(() => 'test')).to.equal(router);
  });

  it('should have patch method and callable', () => {
    expect(router).to.have.property('patch');
    expect(router.patch).to.be.a('function');

    expect(router.patch(() => 'test')).to.equal(router);
  });

  it('should have delete method and callable', () => {
    expect(router).to.have.property('delete');
    expect(router.delete).to.be.a('function');

    expect(router.delete(() => 'test')).to.equal(router);
  });

  it('should build and return all router methods', () => {
    const createdRouter = router
      .build()
      .stack.find((stack) => stack.route.path === router.path);

    expect(createdRouter).to.be.exist;
    expect(createdRouter.route.path).to.equal(router.path);

    expect(createdRouter.route.methods.get).to.be.true;
    expect(createdRouter.route.methods.post).to.be.true;
    expect(createdRouter.route.methods.put).to.be.true;
    expect(createdRouter.route.methods.patch).to.be.true;
    expect(createdRouter.route.methods.delete).to.be.true;
  });
});
