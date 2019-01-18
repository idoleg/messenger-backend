const env = require("getenv");

module.exports = {
    host: env("HTTP_SERVER_HOST", "localhost"),
    port: env.int("HTTP_SERVER_PORT", 80),
    cors: {
        methods: ["GET", "PUT", "POST", "DELETE", "HEAD", "PATH", "LINK", "UNLINK"],
        allowedHeaders: ["Authentication"],
    },
};
