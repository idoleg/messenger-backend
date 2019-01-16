const env = require("./env");

module.exports = {
  mongo: {
    address: env("MONGODB_ADDRESS", "localhost"),
    port: env("MONGODB_PORT", "27017"),
    database: env("MONGODB_DATABASE", "messenger"),
    uri: env("MONGODB_URI", null),
    user: env("MONGODB_USERNAME", null),
    pass: env("MONGODB_PASSWORD", null),
    // autoIndex: ,
    // bufferCommands: ,
    // useCreateIndex: ,
    // useFindAndModify: ,
    // useNewUrlParser: ,
  },
};
