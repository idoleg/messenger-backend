const env = require("./env");

module.exports = {
    privateKey: env("AUTH_PRIVATE_KEY", "superSecret"),
    expiresTime: "30d"
}
