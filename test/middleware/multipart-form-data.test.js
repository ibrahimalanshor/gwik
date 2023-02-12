const { expect } = require('chai');
const { describe, it } = require('mocha');
const supertest = require('supertest');
const path = require('path');
const config = require('../config/config');
const {
  createMultipartFormDataMiddleware,
} = require('../../src/middlewares/multipart-form-data/multipart-form-data.middleware');
const Router = require('../../src/router/router');
const Server = require('../../src/server/server');
const { checkFileExists } = require('../../lib/helpers/fs.helper');

describe('multipart form data middleware test', () => {
  it('should be defined and callable', () => {
    expect(createMultipartFormDataMiddleware).not.to.be.undefined;
    expect(createMultipartFormDataMiddleware).to.be.a('function');
  });

  it('should return array of multipart form data middleware', () => {
    const multipartFormDataMiddleware = createMultipartFormDataMiddleware();

    expect(multipartFormDataMiddleware).to.be.an('array');
    expect(multipartFormDataMiddleware).to.have.length(2);

    for (const multipartFormDataMiddlewareItem of multipartFormDataMiddleware) {
      expect(multipartFormDataMiddlewareItem).to.be.a('function');
    }
  });

  it('should return 400 missing file field', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });
    const router = new Router('/');

    router
      .middleware(
        createMultipartFormDataMiddleware({
          field: 'file',
          allowedTypes: 'png',
          getPath: __dirname,
          getFilename: 'file.png',
        })
      )
      .post(({ req }) => req.file);

    server.addRoute(router.build());
    server.listen();

    try {
      const res = await supertest(config.server.url).post('/').expect(400);

      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal(400);
      expect(res.body).to.have.property('message');
    } finally {
      server.stop();
    }
  });

  it('should return 400 invalid file type', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });
    const router = new Router('/');

    router
      .middleware(
        createMultipartFormDataMiddleware({
          field: 'file',
          allowedTypes: ['png'],
          getPath: () => path.resolve(__dirname, 'uploads'),
          getFilename: () => 'upload.jpg',
        })
      )
      .post(({ req }) => req.file);

    server.addRoute(router.build());
    server.listen();

    try {
      const res = await supertest(config.server.url)
        .post('/')
        .attach('file', __dirname + '/resources/upload.jpg')
        .expect(400);

      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal(400);
      expect(res.body).to.have.property('message');

      const uploadedFileExists = await checkFileExists(
        path.resolve(__dirname, 'uploads', 'upload.jpg')
      );

      expect(uploadedFileExists).to.be.false;
    } finally {
      server.stop();
    }
  });

  it('should return 200 success upload file', async () => {
    const server = new Server({
      port: config.server.port,
      logging: false,
    });
    const router = new Router('/');

    router
      .middleware(
        createMultipartFormDataMiddleware({
          field: 'file',
          allowedTypes: ['png', 'jpg'],
          getPath: () => path.resolve(__dirname, 'uploads'),
          getFilename: () => 'upload.png',
        })
      )
      .post(({ req }) => req.file);

    server.addRoute(router.build());
    server.listen();

    try {
      const res = await supertest(config.server.url)
        .post('/')
        .attach('file', __dirname + '/resources/upload.png')
        .expect(201);

      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal(201);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Created');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.a('object');
      expect(res.body.data).to.have.property('filename');
      expect(res.body.data).to.have.property('path');

      const uploadedFileExists = await checkFileExists(
        path.resolve(__dirname, 'uploads', 'upload.png')
      );

      expect(uploadedFileExists).to.be.true;
    } finally {
      server.stop();
    }
  });
});
