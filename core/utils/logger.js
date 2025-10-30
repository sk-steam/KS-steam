const fs = require('fs').promises;
const path = require('path');

class Logger {
    constructor() {
        this.logPath = path.join(__dirname, '../logs');
        this.logFile = path.join(this.logPath, 'app.log');
    }

    async log(level, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}\n`;

        try {
            await fs.appendFile(this.logFile, logEntry);
        } catch (error) {
            console.error('Logging failed:', error);
        }
    }

    info(message) { this.log('INFO', message); }
    error(message) { this.log('ERROR', message); }
    warn(message) { this.log('WARN', message); }
    debug(message) { this.log('DEBUG', message); }
}

module.exports = new Logger();
