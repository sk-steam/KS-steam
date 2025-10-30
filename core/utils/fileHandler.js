const fs = require('fs').promises;
const path = require('path');

const fileHandler = {
    async readJsonFile(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Failed to read JSON file: ${error.message}`);
        }
    },

    async writeJsonFile(filePath, data) {
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            throw new Error(`Failed to write JSON file: ${error.message}`);
        }
    },

    async ensureDirectory(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
            throw new Error(`Failed to create directory: ${error.message}`);
        }
    }
};

module.exports = fileHandler;
