const env = require("getenv");

module.exports = {
    debug: env.boolish("APP_DEBUG", false),
};
