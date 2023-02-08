# Gwik

Simple express js wrapper, with cors, logger, security add on, and translation.

## Instalation

```bash
npm install gwik
```

## Usage

Simple usage

```js
const { Server, Router } = require('gwik');

// Create Server
const server = new Server();

// Create / GET router
const router = new Router('/').get(() => 'Hello World').build();

// Add Router to Server
server.addRoute(router);

// Run Server
server.listen();
```
