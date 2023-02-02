const express = require('express');

function Router(basePath) {
  const router = express.Router();

  return {
    basePath,
    get: (handler) => (req, (res) => {}),
  };
}

module.exports = Router;
