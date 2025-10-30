const securePatterns = {
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    apiKey: /^[A-Za-z0-9-_]{32,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    secretKey: /^[A-Za-z0-9+/]{32,}$/
};

module.exports = securePatterns;
