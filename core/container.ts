export class Container {
    private services: Map<string, any> = new Map();

    register(key: string, value: any): void {
        this.services.set(key, value);
    }

    get<T>(key: string): T {
        if (!this.services.has(key)) {
            throw new Error(`Service ${key} not found`);
        }
        return this.services.get(key);
    }

    has(key: string): boolean {
        return this.services.has(key);
    }
}
