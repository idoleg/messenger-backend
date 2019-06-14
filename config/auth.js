const env = require("getenv");

module.exports = {
    privateKey: env("AUTH_PRIVATE_KEY", "superSecret"),
    expiresTime: "30d",
};
