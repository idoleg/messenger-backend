const env = require("./env");

module.exports = {
  debug: convertToBool(env("APP_DEBUG", false)),
};

function convertToBool(value) {
  value = value.trim();
  return !(value === "false" || value === 0 || value === false);
}
