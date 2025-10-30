const dotenv = require('dotenv');
const path = require('path');

class EnvHandler {
    constructor() {
        this.loaded = false;
    }

    load() {
        if (this.loaded) return;

        const envPath = path.join(process.cwd(), '.env');
        const envResult = dotenv.config({ path: envPath });

        if (envResult.error) {
            console.warn('No .env file found, using default environment variables');
        }

        this.loaded = true;
    }

    get(key, defaultValue = null) {
        return process.env[key] || defaultValue;
    }

    isDevelopment() {
        return this.get('NODE_ENV', 'development') === 'development';
    }

    isProduction() {
        return this.get('NODE_ENV') === 'production';
    }
}

module.exports = new EnvHandler();
