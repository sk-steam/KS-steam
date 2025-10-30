export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

export class Logger {
    constructor(private context: string = 'App') {}

    private formatMessage(level: LogLevel, message: string): string {
        return `[${new Date().toISOString()}] [${level}] [${this.context}] ${message}`;
    }

    debug(message: string): void {
        console.debug(this.formatMessage(LogLevel.DEBUG, message));
    }

    info(message: string): void {
        console.info(this.formatMessage(LogLevel.INFO, message));
    }

    warn(message: string): void {
        console.warn(this.formatMessage(LogLevel.WARN, message));
    }

    error(message: string, error?: Error): void {
        console.error(this.formatMessage(LogLevel.ERROR, message));
        if (error) {
            console.error(error);
        }
    }
}
