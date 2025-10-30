const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class ConfigWatcher extends EventEmitter {
    constructor(configPath) {
        super();
        this.configPath = configPath;
        this.watcher = null;
    }

    start() {
        this.watcher = fs.watch(path.dirname(this.configPath), (eventType, filename) => {
            if (filename === path.basename(this.configPath)) {
                this.emit('configChanged', { eventType, filename });
            }
        });
    }

    stop() {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
    }
}

module.exports = ConfigWatcher;
