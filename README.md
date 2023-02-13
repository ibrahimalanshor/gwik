# Gwik

Simple express js wrapper, with cors, logger, security add on, and translation.

- [https://github.com/ibrahimalanshor/gwik](https://github.com/ibrahimalanshor/gwik)
- [https://www.npmjs.com/package/gwik](https://www.npmjs.com/package/gwik)

## Instalation

```bash
npm install gwik
```

## Usage

### 1. Simple Usage

```js
const { Server, Router } = require('gwik');

// Crate Server
const server = new Server({
  port: 4000, // port is optional, default 4000
});

// Create Router
const router = new Router('/users').get(() => 'Get Users').build();

// Add Router To Serve
server.addRoute(router);

// Run Server
server.listen();
```

Test

```bash
curh http://localhost:4000/users
# {"status":200,"message":"Ok","data":"Get Users"}
```

> The router automatically creates a response object with `status`, `message` and `data` properties. The result of the route handle function will be put in the `data` property.

---

### 2. Http Methods

```js
const { Server, Router } = require('gwik');

// Crate Server
const server = new Server();

// Create Router
const routes = [
  new Router('/users').get(() => 'Get Users').build(),
  new Router('/users').post(() => 'Create User').build(),
  new Router('/users/:id').put(() => 'Update User').build(),
  new Router('/users/:id/password').patch(() => 'Update User Password').build(),
  new Router('/users/:id').delete(() => 'Delete User').build(),
];

// Add Router To Serve
server.addRoute(routes);

// Run Server
server.listen();
```

> `new Server().addRoute` can accept an array of routes as arguments

> You can override the default response status code by adding the status code in the second argument in the route handle, `new Router('/users').get(() => 'Get Users', 201).build()`

---

### 3. Async Route Handle

```js
const { Server, Router } = require('gwik');

// Crate Server
const server = new Server();

// Promise
const getUsers = () =>
  new Promise((resolve) => setTimeout(() => resolve('Get Users'), 5000));

// Create Router
const router = new Router('/users').get(async () => await getUsers()).build();

// Add Router To Serve
server.addRoute(router);

// Run Server
server.listen();
```

---

### 4. Access Express Request Object

First argument in handler route is context object, which has express request and response object.

```js
const { Server, Router } = require('gwik');

// Crate Server
const server = new Server();

// Create Router
const router = new Router('/users')
  .get(({ req, res }) => {
    // You can access the express request and response objects, via the req and res properties

    return req.headers;
  })
  .build();

// Add Router To Serve
server.addRoute(router);

// Run Server
server.listen();
```

---

### 5. Route Middleware

```js
const { Server, Router } = require('gwik');

// Crate Server
const server = new Server();

// Create Log Middleware
const logMiddleware = (req, res, next) => {
  console.log('log');

  // make sure next is called
  next();
};

// Create Post Router
const router = new Router('/users')
  .middleware(logMiddleware)
  .get(() => 'Get User')
  .build();

// Add Router To Serve
server.addRoute(router);

// Run Server
server.listen();
```

---

### 6. Translation

```js
const { Server, Router } = require('gwik');

// Messages
const messages = {
  en: {
    greet: 'Hello World',
  },
};

// Crate Server
const server = new Server({
  t9n: {
    locale: 'en', // set locale, default en
    fallbackLocale: 'en', // set fallback locale, default en
    messages,
  },
});

// Create Routes
const router = new Router('/users')
  .get(({ t }) => t.translate('greet'))
  .build();

// Add Routes To Serve
server.addRoute(router);

// Run Server
server.listen();
```

---

### 7. Request Body Validation

Gwik comes with a `createBodyValidationMiddleware` function for creating body validation middleware.

To create the body schema, install `express-validator` first.

```bash
npm install express-validator@^6.14.3
```

```js
const { Server, Router, createBodyValidationMiddleware } = require('gwik');
const { body } = require('express-validator');

// Validation Schema
const userSchema = [body('name').exists(), body('address').exists()];

// Crate Server
const server = new Server();

// Create Routes
const router = new Router('/users')
  .middleware(createBodyValidationMiddleware(userSchema))
  .post(({ req }) => req.body)
  .build();

// Add Routes To Serve
server.addRoute(router);

// Run Server
server.listen();
```

Test

```bash
curl -X POST http://localhost:4000/users
# {"status":422,"message":"Unprocessable Entity","errors":{"name":{"msg":"Invalid value","param":"name","location":"body"},"address":{"msg":"Invalid value","param":"address","location":"body"}}}
```

---

### 8. File Upload

Gwik comes with a `createMultipartFormdataMiddleware` function for creating file upload middleware.

```js
const { Server, Router, createMultipartFormDataMiddleware } = require('gwik');

// Create File Upload Middleware
const fileUploadMiddleware = createMultipartFormDataMiddleware({
  field: 'image', // form data field
  allowedTypes: '.png', // allowed file types
  getPath: ({ req, file }) => path.resolve(__dirname + 'uploads'), // get destination path name
  getFilename: ({ req, file }) => 'upload.png', // get filename
});

// Crate Server
const server = new Server();

// Create Routes
const router = new Router('/users')
  .middleware(fileUploadMiddleware)
  .post(({ req }) => req.body)
  .build();

// Add Routes To Serve
server.addRoute(router);

// Run Server
server.listen();
```

> The `getPath` and `getFilename` methods refer to the multer `diskStorage.destination` and `diskStorage.filename` method, see [https://www.npmjs.com/package/multer](https://www.npmjs.com/package/multer) for a full explanation

---

### 9. Static Files

```js
const path = require('path');
const { Server } = require('gwik');

// Crate Server
const server = new Server();

// Add Static Route
server.addStaticRoute('/public', path.resolve('public'));

// Run Server
server.listen();
```

---

### 10 . Exceptions

```js
const { Server, Router, UnauthorizedException } = require('gwik');

// Crate Server
const server = new Server();

// Add Router
const router = new Router('/users')
  .get(() => {
    throw new UnauthorizedException('Forbidden');
  })
  .build();

// Add Router to Server
server.addRoute(router);

// Run Server
server.listen();
```

Test

```bash
curl http://localhost:4000/users
# {"status":401,"message":"Unauthorized","errors":"Forbidden"}
```

Available Exceptions:

- BadRequestException
- ConflictException
- ForbiddenException
- NotFoundException
- UnauthorizedException
- UnprocessableEntityException

---

## API

### new Server(options)

- **Return** : Object - Server Instance
  - server : express instance
  - httpServer: Node Http Module
- **Params** :
  - options : Object (optional)
    - port : Number (default `4000`)
    - logging : Boolean (default `true`)
    - middleware : Object (optional)
      - cors : Object ([https://www.npmjs.com/package/cors](https://www.npmjs.com/package/cors))
      - helmet : Object ([https://www.npmjs.com/package/helmet](https://www.npmjs.com/package/helmet))
      - morgan : Object (optional)
        - format: String (default `tiny`)
        - options : Object ([https://www.npmjs.com/package/morgan](https://www.npmjs.com/package/morgan))
    - t9n: Object (optional)
      - locale : String (default `en`)
      - fallbackLocale : String (default `en`)
      - messages : Object (default `{}`)

### Server.prototype.listen

- **Params** :
  - callback : Function (optional)

### Server.prototype.stop

### Server.prototype.addRoute

- **Params** :
  - Route : Array || Function

### Server.prototype.addStaticRoute

- **Params** :
  - path : String
  - dir : String

### new Router(path)

- **Return** : Router Instance
- **Params** :
  - path: String

### Router.prototype.get

- **Return** : Router Instance
- **Params** :
  - handler: Function

### Router.prototype.post

- **Return** : Router Instance
- **Params** :
  - handler: Function

### Router.prototype.put

- **Return** : Router Instance
- **Params** :
  - handler: Function

### Router.prototype.patch

- **Return** : Router Instance
- **Params** :
  - handler: Function

### Router.prototype.delete

- **Return** : Router Instance
- **Params** :
  - handler: Function

### Router.prototype.middleware

- **Return** : Router Instance
- **Params** :
  - middlewares : Express Router

### Router.prototype.build

- **Return** : Express Router

### Router.prototype.build

- **Return** : Express Router

### createBodyValidationMiddleware

- **Return** : Express Middleware
- **Params** :
  - schema : Express Validator Schema

### createMultipartFormDataMiddleware

- **Return** : Express Middleware
- **Params** :
  - storageConfig : Object
    - field : String
    - allowedTypes: Array
    - getPath : Function
    - getFilename : Function
