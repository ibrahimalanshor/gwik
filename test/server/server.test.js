const http = require('http');
const supertest = require('supertest');
const { describe, it } = require('mocha');
const expect = require('chai').expect;
const Server = require('../../src/server/server');

describe('server test', () => {
  it('should defined and callable', () => {
    expect(Server).to.not.be.undefined;
    expect(Server).to.be.a('function');
  });

  it('should has express object property', () => {
    expect(new Server()).to.have.property('server');
  });

  it('should has config object property', () => {
    const app = new Server();

    expect(app).to.have.property('config');
    expect(app.config).to.be.a('object');
  });

  it('should has default port config', () => {
    const app = new Server();

    expect(app.config.port).to.exist;
    expect(app.config.port).to.equal(4000);
  });

  it('should set port config', () => {
    const app = new Server({
      port: 5000,
    });

    expect(app.config.port).to.equal(5000);
  });

  it('should has callable listen method', () => {
    const app = new Server();

    expect(app).to.have.property('listen');
    expect(app.listen).to.be.a('function');
  });

  it('should has callable stop method', () => {
    const app = new Server();

    expect(app).to.have.property('stop');
    expect(app.stop).to.be.a('function');
  });

  it('should start a server', (done) => {
    const app = new Server();

    app.listen(() => {});

    expect(app).to.have.property('httpServer');
    expect(app.httpServer).to.be.an.instanceOf(http.Server);

    supertest('http://localhost:4000')
      .get('/')
      .expect(404)
      .end((err) => {
        app.stop();

        if (err) return done(err);

        done();
      });
  });
});