const { describe, it } = require('mocha');
const config = require('../config/config');
const messages = require('./resources/messages.json');
const Server = require('../../src/server/server');
const Router = require('../../src/router/router');
const supertest = require('supertest');
const { expect } = require('chai');

describe('t9n test', () => {
  it('should return translated key from t methods request object', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
      t9n: {
        locale: 'en',
        messages,
      },
    });

    server.addRoute([
      new Router('/hello').get(({ t }) => t.translate('hello')).build(),
      new Router('/greet')
        .get(({ t }) => t.translate('greet', { name: 'jhon' }))
        .build(),
      new Router('/action').get(({ t }) => t.translate('action.save')).build(),
    ]);

    server.listen();

    try {
      const hello = await supertest(config.server.url)
        .get('/hello')
        .expect(200);
      expect(hello.body.data).to.equal(messages.en.hello);

      const greet = await supertest(config.server.url)
        .get('/greet')
        .expect(200);
      expect(greet.body.data).to.equal('Good morning jhon');

      const action = await supertest(config.server.url)
        .get('/action')
        .expect(200);
      expect(action.body.data).to.equal(messages.en.action.save);
    } finally {
      server.stop();
    }
  });

  it('should return translated key by request header locale', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
      t9n: {
        locale: 'en',
        messages,
      },
    });

    server.addRoute([
      new Router('/hello').get(({ t }) => t.translate('hello')).build(),
      new Router('/greet').get(({ t }) => t.translate('greet')).build(),
    ]);

    server.listen();

    try {
      const hello = await supertest(config.server.url)
        .get('/hello')
        .set('accept-language', 'id')
        .expect(200);
      expect(hello.body.data).to.equal(messages.id.hello);

      const greet = await supertest(config.server.url)
        .get('/greet')
        .set('accept-language', 'id')
        .expect(200);
      expect(greet.body.data).to.equal(messages.en.greet);
    } finally {
      server.stop();
    }
  });
});
