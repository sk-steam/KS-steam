const crypto = require('crypto');

const helpers = {
    generateId: () => crypto.randomBytes(16).toString('hex'),
    
    sanitizeInput: (input) => {
        if (typeof input === 'string') {
            return input.trim().replace(/[<>]/g, '');
        }
        return input;
    },
    
    formatDate: (date) => {
        return new Date(date).toISOString();
    },
    
    isValidEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    generateHash: (data) => {
        return crypto.createHash('sha256').update(data).digest('hex');
    },
    
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    isValidUrl: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    randomNumber: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

module.exports = helpers;
