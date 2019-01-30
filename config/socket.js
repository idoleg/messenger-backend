module.exports = {
    port: 80,
    host: "localhost",
    //path: "/socket",
    autoAcceptConnections: false,
    keepalive: true,
    keepaliveInterval: 5000, //20000
    dropConnectionOnKeepaliveTimeout: true,
    keepaliveGracePeriod: 2500, //10000
    closeTimeout: 5000,
};
