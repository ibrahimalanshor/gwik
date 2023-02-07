const { describe, it } = require('mocha');
const { expect } = require('chai');
const supertest = require('supertest');
const config = require('../config/config');
const Server = require('../../src/server/server');
const Router = require('../../src/router/router');
const { UnauthorizedException } = require('../../src/exceptions');

describe('http router test', () => {
  it('should add a route to the server', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });
    const router = new Router('/test');

    router.get(() => 'test');

    server.addRoute(router.build());
    server.listen();

    try {
      const res = await supertest(config.server.url).get('/test').expect(200);

      expect(res).to.be.a('object');
      expect(res).to.have.property('body');
      expect(res.body).to.be.a('object');
      expect(res.body.status).to.eq(200);
      expect(res.body.message).to.eq('Ok');
      expect(res.body.data).to.eq('test');
    } finally {
      server.stop();
    }
  });

  it('should add a async route to the server', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });
    const router = new Router('/test');

    router.post(async () => {
      return await new Promise((resolve) => {
        setTimeout(() => resolve('OK'), 1000);
      });
    });

    server.addRoute(router.build());
    server.listen();

    try {
      const res = await supertest(config.server.url).post('/test').expect(201);

      expect(res).to.be.a('object');
      expect(res).to.have.property('body');
      expect(res.body).to.be.a('object');
      expect(res.body.status).to.eq(201);
      expect(res.body.message).to.eq('Created');
      expect(res.body.data).to.eq('OK');
    } finally {
      server.stop();
    }
  });

  it('should add a route with custom response status code to the server', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });
    const router = new Router('/test');

    router.get(() => 'No Content', 204);

    server.addRoute(router.build());
    server.listen();

    try {
      await supertest(config.server.url).get('/test').expect(204);
    } finally {
      server.stop();
    }
  });

  it('should response 500 http error code', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });
    const router = new Router('/test');

    router.get(() => undefinedFunction());

    server.addRoute(router.build());
    server.listen();

    try {
      const res = await supertest(config.server.url).get('/test').expect(500);

      expect(res).to.be.a('object');
      expect(res).to.have.property('body');
      expect(res.body).to.be.a('object');
      expect(res.body.status).to.eq(500);
      expect(res.body.message).to.eq('Internal Server Error');
    } finally {
      server.stop();
    }
  });

  it('should response 401 http error code', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });
    const router = new Router('/test');

    router.get(() => {
      throw new UnauthorizedException();
    });

    server.addRoute(router.build());
    server.listen();

    try {
      const res = await supertest(config.server.url).get('/test').expect(401);

      expect(res).to.be.a('object');
      expect(res).to.have.property('body');
      expect(res.body).to.be.a('object');
      expect(res.body.status).to.eq(401);
      expect(res.body.message).to.eq('Unauthorized');
    } finally {
      server.stop();
    }
  });
});
