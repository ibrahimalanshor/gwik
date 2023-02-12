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
        expect(res.body.status).to.eq(error.status);
      } finally {
        server.stop();
      }
    });
  }
});
