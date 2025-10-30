export type NextFunction = () => Promise<void>;
export type Middleware = (req: any, res: any, next: NextFunction) => Promise<void>;

export class MiddlewareChain {
    private middlewares: Middleware[] = [];

    use(middleware: Middleware): void {
        this.middlewares.push(middleware);
    }

    async execute(req: any, res: any): Promise<void> {
        const runner = async (index: number): Promise<void> => {
            if (index < this.middlewares.length) {
                await this.middlewares[index](req, res, () => runner(index + 1));
            }
        };
        await runner(0);
    }
}
