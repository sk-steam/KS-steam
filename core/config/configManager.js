const fs = require('fs').promises;
const path = require('path');

class ConfigManager {
    constructor() {
        this.config = {};
        this.configPath = path.join(__dirname, 'config.json');
    }

    async load() {
        try {
            const data = await fs.readFile(this.configPath, 'utf8');
            this.config = JSON.parse(data);
        } catch (error) {
            throw new Error(`Failed to load config: ${error.message}`);
        }
    }

    get(key) {
        return key.split('.').reduce((obj, part) => obj && obj[part], this.config);
    }

    set(key, value) {
        const parts = key.split('.');
        let current = this.config;
        
        for (let i = 0; i < parts.length - 1; i++) {
            current[parts[i]] = current[parts[i]] || {};
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
    }

    async save() {
        try {
            await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
        } catch (error) {
            throw new Error(`Failed to save config: ${error.message}`);
        }
    }

    getEnvironment() {
        return process.env.NODE_ENV || 'development';
    }

    async loadEnvironmentConfig() {
        const env = this.getEnvironment();
        const envConfigPath = path.join(__dirname, `config.${env}.json`);
        
        try {
            const envData = await fs.readFile(envConfigPath, 'utf8');
            const envConfig = JSON.parse(envData);
            this.config = { ...this.config, ...envConfig };
        } catch (error) {
            console.warn(`Environment config not found for ${env}`);
        }
    }

    async exportConfig(exportPath) {
        try {
            const exportData = {
                config: this.config,
                timestamp: new Date().toISOString(),
                environment: this.getEnvironment()
            };
            await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2));
        } catch (error) {
            throw new Error(`Export failed: ${error.message}`);
        }
    }

    async importConfig(importPath) {
        try {
            const importData = JSON.parse(await fs.readFile(importPath, 'utf8'));
            this.config = importData.config;
            await this.save();
        } catch (error) {
            throw new Error(`Import failed: ${error.message}`);
        }
    }

    getDefaultConfig() {
        return {
            server: {
                port: 3000,
                host: 'localhost'
            },
            database: {
                host: 'localhost',
                port: 3306,
                name: 'ks_steam'
            },
            api: {
                version: '1.0',
                timeout: 5000
            }
        };
    }

    reset() {
        this.config = this.getDefaultConfig();
        return this.save();
    }
}

module.exports = new ConfigManager();
