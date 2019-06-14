const env = require("getenv");

env.disableErrors();

module.exports = {
    mongo: {
        address: env("MONGODB_ADDRESS", "localhost"),
        port: env.int("MONGODB_PORT", 27017),
        database: env("MONGODB_DATABASE", "messenger"),
        uri: env("MONGODB_URI"),
        user: env("MONGODB_USERNAME"),
        pass: env("MONGODB_PASSWORD"),
        // autoIndex: ,
        // bufferCommands: ,
        // useCreateIndex: ,
        // useFindAndModify: ,
        // useNewUrlParser: ,
    },
};
