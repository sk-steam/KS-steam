import { ValidationError } from '../errors';

export class Validator {
    static isString(value: any, field: string): void {
        if (typeof value !== 'string') {
            throw new ValidationError(`${field} must be a string`);
        }
    }

    static isNumber(value: any, field: string): void {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new ValidationError(`${field} must be a number`);
        }
    }

    static isNotEmpty(value: any, field: string): void {
        if (!value || value.toString().trim().length === 0) {
            throw new ValidationError(`${field} cannot be empty`);
        }
    }
}
