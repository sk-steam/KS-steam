const os = require('os');
const logger = require('./logger');

class SystemMonitor {
    getSystemInfo() {
        return {
            uptime: os.uptime(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            cpuUsage: os.loadavg(),
            platform: os.platform()
        };
    }

    async monitor() {
        const info = this.getSystemInfo();
        const memoryUsage = ((info.totalMemory - info.freeMemory) / info.totalMemory * 100).toFixed(2);
        
        if (memoryUsage > 90) {
            logger.warn(`High memory usage: ${memoryUsage}%`);
        }

        return info;
    }
}

module.exports = new SystemMonitor();
