const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class SecureConfig {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.keyPath = path.join(__dirname, '.secret');
        this.keyVersion = 1;
        this.rotationInterval = 30 * 24 * 60 * 60 * 1000; // 30 days
    }

    async encrypt(data) {
        const key = await this.getEncryptionKey();
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();

        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    async decrypt(data) {
        const key = await this.getEncryptionKey();
        const decipher = crypto.createDecipheriv(
            this.algorithm, 
            key, 
            Buffer.from(data.iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(data.authTag, 'hex'));
        
        let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    }

    async getEncryptionKey() {
        try {
            return await fs.readFile(this.keyPath);
        } catch {
            const key = crypto.randomBytes(32);
            await fs.writeFile(this.keyPath, key);
            return key;
        }
    }

    async rotateKey() {
        const oldKey = await this.getEncryptionKey();
        const newKey = crypto.randomBytes(32);
        await fs.writeFile(
            `${this.keyPath}.${this.keyVersion + 1}`, 
            newKey
        );
        this.keyVersion++;
        return { oldKey, newKey };
    }

    async encryptWithVersion(data) {
        const encrypted = await this.encrypt(data);
        return {
            ...encrypted,
            version: this.keyVersion
        };
    }

    async validateValue(value, pattern) {
        if (!value || typeof value !== 'string') return false;
        return new RegExp(pattern).test(value);
    }

    async createSecureBackup() {
        const backupPath = path.join(__dirname, 'secure-backups');
        const timestamp = Date.now();
        await fs.mkdir(backupPath, { recursive: true });
        await fs.copyFile(
            this.keyPath,
            path.join(backupPath, `.secret.${timestamp}`)
        );
    }
}

module.exports = new SecureConfig();
