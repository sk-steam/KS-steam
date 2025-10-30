import { AppConfig, defaultConfig } from './config';
import { Container } from './container';
import { MiddlewareChain } from './middleware';
import { Router } from './router';

export class App {
    private config: AppConfig;
    private container: Container;
    private middleware: MiddlewareChain;
    private router: Router;

    constructor(config: Partial<AppConfig> = {}) {
        this.config = { ...defaultConfig, ...config };
        this.container = new Container();
        this.middleware = new MiddlewareChain();
        this.router = new Router();

        // Register core services
        this.container.register('config', this.config);
        this.container.register('router', this.router);
    }

    async start(): Promise<void> {
        console.log(`Starting application on port ${this.config.port}`);
        // TODO: Initialize server and routes
    }

    async stop(): Promise<void> {
        console.log('Stopping application');
        // TODO: Cleanup resources
    }

    useMiddleware(middleware: any): void {
        this.middleware.use(middleware);
    }

    getContainer(): Container {
        return this.container;
    }
}
