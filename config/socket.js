module.exports = {
    port: 2121,
    host: "localhost",
    path: "/",
    autoAcceptConnections: false,
    keepalive: true,
    keepaliveInterval: 5000, //20000
    dropConnectionOnKeepaliveTimeout: true,
    keepaliveGracePeriod: 2500, //10000
    closeTimeout: 5000,
};
