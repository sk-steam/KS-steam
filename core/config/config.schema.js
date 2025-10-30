const configSchema = {
    type: 'object',
    required: ['server', 'database', 'api'],
    properties: {
        server: {
            type: 'object',
            required: ['port', 'host'],
            properties: {
                port: { type: 'number', minimum: 1, maximum: 65535 },
                host: { type: 'string' }
            }
        },
        database: {
            type: 'object',
            required: ['host', 'port', 'name'],
            properties: {
                host: { type: 'string' },
                port: { type: 'number' },
                name: { type: 'string' }
            }
        },
        api: {
            type: 'object',
            required: ['version'],
            properties: {
                version: { type: 'string' },
                timeout: { type: 'number' }
            }
        }
    }
};

module.exports = configSchema;
