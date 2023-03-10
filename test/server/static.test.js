const { expect } = require('chai');
const { describe, it } = require('mocha');
const path = require('path');
const supertest = require('supertest');
const config = require('../config/config');
const Router = require('../../src/router/router');
const Server = require('../../src/server/server');

describe('server static test', () => {
  it('should defined and callable', () => {
    const server = new Server();

    expect(server).to.have.property('addStaticRoute');
    expect(server.addStaticRoute).to.be.a('function');
  });

  it('should return static file', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });

    server.addStaticRoute('/public', path.resolve(__dirname, 'public'));
    server.listen();

    try {
      await supertest(config.server.url)
        .get('/public/image.png')
        .expect(200)
        .expect('Content-Type', 'image/png');
    } finally {
      server.stop();
    }
  });
});
