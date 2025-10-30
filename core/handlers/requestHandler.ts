import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logger';

const logger = new Logger('RequestHandler');

export const asyncHandler = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            logger.error('Request handling failed', error as Error);
            next(error);
        }
    };
};
