import { Request, Response, NextFunction } from 'express';
import { authorizeRole } from '../../middleware/authorize-role';
import { ForbiddenError } from '../../utils/errors';

describe('authorizeRole middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn();
  });

  it('should call next() if user has the required role', () => {
    mockRequest.user = { id: '123', role: 'admin' };
    const middleware = authorizeRole('admin');
    middleware(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next with ForbiddenError if user does not have the required role', () => {
    mockRequest.user = { id: '123', role: 'user' };
    const middleware = authorizeRole('admin');
    middleware(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    const error = (mockNext as jest.Mock).mock.calls[0][0];
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe('Forbidden: Insufficient permissions');
  });

  it('should call next with ForbiddenError if user is not defined', () => {
    mockRequest.user = undefined;
    const middleware = authorizeRole('admin');
    middleware(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    const error = (mockNext as jest.Mock).mock.calls[0][0];
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe('Forbidden: Insufficient permissions');
  });

  it('should call next() if user has one of multiple required roles', () => {
    mockRequest.user = { id: '123', role: 'editor' };
    const middleware = authorizeRole('admin', 'editor');
    middleware(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next with ForbiddenError if user does not have any of the required roles', () => {
    mockRequest.user = { id: '123', role: 'viewer' };
    const middleware = authorizeRole('admin', 'editor');
    middleware(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    const error = (mockNext as jest.Mock).mock.calls[0][0];
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe('Forbidden: Insufficient permissions');
  });
});
