const { body } = require('express-validator');
const { expect } = require('chai');
const { describe } = require('mocha');
const config = require('../config/config');
const Server = require('../../src/server/server');
const Router = require('../../src/router/router');
const {
  createBodyValidationMiddleware,
} = require('../../src/middlewares/body-validation/body-validation.middleware');
const supertest = require('supertest');

describe('body validation middleware test', () => {
  it('should defined and callable', () => {
    expect(createBodyValidationMiddleware).not.to.be.undefined;
    expect(createBodyValidationMiddleware).to.be.a('function');
  });

  it('should return array of express middleware', () => {
    const bodyValidationMiddleware = createBodyValidationMiddleware(
      [body('name').exists()],
      {}
    );

    expect(bodyValidationMiddleware).to.be.an('array');
    expect(bodyValidationMiddleware).to.have.length(2);

    if (Array.isArray(bodyValidationMiddleware[0])) {
      bodyValidationMiddleware[0].forEach((schema) =>
        expect(schema).to.be.a('function')
      );
    } else {
      expect(bodyValidationMiddleware[0]).to.be.a('function');
    }

    expect(bodyValidationMiddleware[1]).to.be.a('function');
  });

  it('should return 422', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });
    const router = new Router('/');

    router
      .middleware(createBodyValidationMiddleware([body('name').exists()]))
      .post(({ req }) => req.body);

    server.addRoute(router.build());

    server.listen();

    try {
      const res = await supertest(config.server.url).post('/').expect(422);

      expect(res).to.have.property('body');
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal(422);
      expect(res.body.message).to.equal('Unprocessable Entity');
      expect(res.body.errors).to.be.a('object');
      expect(res.body.errors).to.have.property('name');
    } finally {
      server.stop();
    }
  });

  it('should return matched data from validation result', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });
    const router = new Router('/');

    router
      .middleware(createBodyValidationMiddleware([body('name').exists()]))
      .post(({ req }) => req.body);

    server.addRoute(router.build());

    server.listen();

    try {
      const res = await supertest(config.server.url)
        .post('/')
        .send({ name: 'test', invalid: 'test' })
        .expect(201);

      expect(res).to.have.property('body');
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal(201);
      expect(res.body.message).to.equal('Created');
      expect(res.body.data).to.be.a('object');
      expect(res.body.data).to.have.property('name');
      expect(res.body.data).not.to.have.property('invalid');
      expect(res.body.data.name).to.eq('test');
    } finally {
      server.stop();
    }
  });
});
