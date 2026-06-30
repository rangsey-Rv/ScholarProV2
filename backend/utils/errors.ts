import { AppError } from "@middleware/app-error";

export class ValidationError extends AppError {
  constructor(message: string | object = 'Validation failed') {
    const formatted =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    super(formatted, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict error (e.g., duplicate entry)') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden: Insufficient permissions') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}