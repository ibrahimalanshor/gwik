const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../../', '.env.test'),
});

module.exports = {
  server: {
    port: process.env.SERVER_PORT,
    url: process.env.SERVER_URL,
  },
};
