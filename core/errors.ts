export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(404, message);
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(400, message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(401, message);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Access forbidden') {
        super(403, message);
    }
}

export class DatabaseError extends AppError {
    constructor(message = 'Database operation failed') {
        super(500, message);
    }
}
