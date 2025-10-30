export interface Route {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    handler: (req: any, res: any) => Promise<void>;
}

export class Router {
    private routes: Route[] = [];

    addRoute(route: Route): void {
        this.routes.push(route);
    }

    getRoutes(): Route[] {
        return this.routes;
    }
}
