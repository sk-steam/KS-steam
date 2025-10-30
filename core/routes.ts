import { Router, Request, Response } from 'express';
import { Logger } from './logger';

export class RouteManager {
    private router: Router;
    private logger: Logger;

    constructor() {
        this.router = Router();
        this.logger = new Logger('Routes');
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.get('/api/health', (req: Request, res: Response) => {
            res.json({ status: 'ok' });
        });

        this.router.use('/api/*', (req: Request, res: Response) => {
            res.status(404).json({
                status: 'error',
                message: 'API endpoint not found'
            });
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}
