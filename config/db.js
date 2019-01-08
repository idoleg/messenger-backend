const env = require("./env");

module.exports = {
  mongo: {
    address: env("MONGODB_ADDRESS", "localhost"),
    port: env("MONGODB_PORT", "27017"),
    database: env("MONGODB_DATABASE", "messenger"),
    // database: string,
    // user: string,
    // pass: string,
    // autoIndex: ,
    // bufferCommands: ,
    // useCreateIndex: ,
    // useFindAndModify: ,
    // useNewUrlParser: ,
  },
};
