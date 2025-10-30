const fs = require('fs').promises;
const path = require('path');

class ConfigBackup {
    constructor() {
        this.backupDir = path.join(__dirname, 'backups');
        this.maxBackups = 5;
    }

    async createBackup(config) {
        await this.ensureBackupDir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, `config-${timestamp}.json`);
        
        await fs.writeFile(backupPath, JSON.stringify(config, null, 2));
        await this.cleanOldBackups();
    }

    async ensureBackupDir() {
        try {
            await fs.mkdir(this.backupDir, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') throw error;
        }
    }

    async cleanOldBackups() {
        const files = await fs.readdir(this.backupDir);
        if (files.length <= this.maxBackups) return;

        const sortedFiles = files
            .map(file => ({ file, time: fs.stat(path.join(this.backupDir, file)) }))
            .sort((a, b) => b.time - a.time);

        for (let i = this.maxBackups; i < sortedFiles.length; i++) {
            await fs.unlink(path.join(this.backupDir, sortedFiles[i].file));
        }
    }
}

module.exports = new ConfigBackup();
