const mysql = require('mysql2/promise');
const configManager = require('../config/configManager');

class DatabaseConnector {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            this.connection = await mysql.createConnection({
                host: configManager.get('database.host'),
                user: configManager.get('database.user'),
                password: configManager.get('database.password'),
                database: configManager.get('database.name')
            });
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    async query(sql, params = []) {
        if (!this.connection) {
            await this.connect();
        }
        try {
            const [results] = await this.connection.execute(sql, params);
            return results;
        } catch (error) {
            console.error('Query error:', error);
            throw error;
        }
    }
}

module.exports = new DatabaseConnector();
