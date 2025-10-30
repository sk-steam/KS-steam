const Ajv = require('ajv');
const schema = require('./config.schema');

class ConfigValidator {
    constructor() {
        this.ajv = new Ajv();
        this.validate = this.ajv.compile(schema);
    }

    validateConfig(config) {
        if (!this.validate(config)) {
            throw new Error(`Config validation failed: ${JSON.stringify(this.validate.errors)}`);
        }
        return true;
    }

    validateValue(key, value) {
        const schema = this.getSchemaForKey(key);
        if (!schema) return true;
        
        const validate = this.ajv.compile(schema);
        return validate(value);
    }
}

module.exports = new ConfigValidator();
