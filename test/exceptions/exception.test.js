const { describe, it } = require('mocha');
const { expect } = require('chai');
const supertest = require('supertest');
const config = require('../config/config');
const Server = require('../../src/server/server');
const Router = require('../../src/router/router');
const exceptions = require('../../src/exceptions');
const messages = require('./resources/messages.json');

describe('exceptions test', () => {
  for (const exception in exceptions) {
    it(`${exception} test`, async () => {
      const server = new Server({
        port: config.server.port,
        logging: false,
        t9n: {
          messages,
        },
      });
      const router = new Router('/test');
      const error = new exceptions[exception]();

      router.get(() => {
        throw error;
      });

      server.addRoute(router.build());
      server.listen();

      try {
        const res = await supertest(config.server.url)
          .get('/test')
          .expect(error.status);

        expect(res).to.be.a('object');
        expect(res).to.have.property('body');
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.eq(error.status);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.eq(messages.en.http[res.body.status]);
      } finally {
        server.stop();
      }
    });
  }

  it('should return custom exception message', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
      t9n: {
        messages,
      },
    });
    const router = new Router('/test');

    router.get(() => {
      throw new exceptions.BadRequestException({}, 'error');
    });

    server.addRoute(router.build());
    server.listen();

    try {
      const res = await supertest(config.server.url).get('/test').expect(400);

      expect(res).to.be.a('object');
      expect(res).to.have.property('body');
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.eq(400);
      expect(res.body).to.have.property('message');

      expect(res.body.message).to.eq(messages.en.error);
    } finally {
      server.stop();
    }
  });

  it('should return custom raw message', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });
    const router = new Router('/test');

    router.get(() => {
      throw new exceptions.BadRequestException({}, 'something error').useRaw();
    });

    server.addRoute(router.build());
    server.listen();

    try {
      const res = await supertest(config.server.url).get('/test').expect(400);

      expect(res).to.be.a('object');
      expect(res).to.have.property('body');
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.eq(400);
      expect(res.body).to.have.property('message');

      expect(res.body.message).to.eq('something error');
    } finally {
      server.stop();
    }
  });
});
