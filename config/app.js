const env = require("getenv");

module.exports = {
    debug: env.boolish("APP_DEBUG", false),
    env: env("APP_ENV", "production"),
};
