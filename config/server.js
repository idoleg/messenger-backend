const env = require('./env');

module.exports = {
  port: env("HTTP_SERVER_PORT"),
  host: env("HTTP_SERVER_HOST"),
  cors: {
    methods: ["GET", "PUT", "POST", "DELETE", "HEAD", "PATH", "LINK", "UNLINK"],
  },
};
