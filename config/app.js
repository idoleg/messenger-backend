const env = require("./env");

module.exports = {
    debug: env("APP_DEBUG", false),
};
