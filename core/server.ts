import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import { Logger } from './logger';
import { AppError } from './errors';

export class Server {
    private app: Express;
    private logger: Logger;

    constructor() {
        this.app = express();
        this.logger = new Logger('Server');
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    private setupMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(helmet());
    }

    private setupRoutes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });
    }

    private setupErrorHandling(): void {
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof AppError) {
                return res.status(err.statusCode).json({
                    status: 'error',
                    message: err.message
                });
            }

            this.logger.error('Unhandled error', err);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        });
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            this.logger.info(`Server running on port ${port}`);
        });
    }
}
