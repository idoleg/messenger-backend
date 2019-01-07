module.exports = function env(key, defaultValue = null) {
    return process.env[key] || defaultValue;
};
