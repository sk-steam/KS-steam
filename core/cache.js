class Cache {
    constructor() {
        this.store = new Map();
        this.defaultTTL = 3600; // 1 hour in seconds
    }

    set(key, value, ttl = this.defaultTTL) {
        const expireAt = Date.now() + (ttl * 1000);
        this.store.set(key, {
            value,
            expireAt
        });
    }

    get(key) {
        const item = this.store.get(key);
        if (!item) return null;
        
        if (Date.now() > item.expireAt) {
            this.store.delete(key);
            return null;
        }
        
        return item.value;
    }

    clear() {
        this.store.clear();
    }
}

module.exports = new Cache();
