import { errorHandlerMiddleware } from './errorHandler';
import { ERROR_CODES } from '../constants/errorCodes';

describe('errorHandlerMiddleware', () => {
  let req, res, next, middleware;

  beforeEach(() => {
    req = {}; // Request object is not used in the middleware
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn(); // Mock next function
    middleware = errorHandlerMiddleware(ERROR_CODES);
  });

  test('should handle ER_DUP_ENTRY correctly', () => {
    const error = { code: 'ER_DUP_ENTRY' };

    middleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_CODES.ER_DUP_ENTRY.status);
    expect(res.json).toHaveBeenCalledWith({
      status: ERROR_CODES.ER_DUP_ENTRY.status,
      message: ERROR_CODES.ER_DUP_ENTRY.error,
      code: ERROR_CODES.ER_DUP_ENTRY.code,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle UnauthorizedError correctly', () => {
    const error = { name: 'UnauthorizedError' };

    middleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_CODES.UnauthorizedError.status);
    expect(res.json).toHaveBeenCalledWith({
      status: ERROR_CODES.UnauthorizedError.status,
      message: ERROR_CODES.UnauthorizedError.error,
      code: ERROR_CODES.UnauthorizedError.code,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle an unknown error code or name with INTERNAL_ERROR', () => {
    const error = { code: 'UNKNOWN_ERROR' };

    middleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_CODES.INTERNAL_ERROR.status);
    expect(res.json).toHaveBeenCalledWith({
      status: ERROR_CODES.INTERNAL_ERROR.status,
      message: ERROR_CODES.INTERNAL_ERROR.error,
      code: ERROR_CODES.INTERNAL_ERROR.code,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle missing error properties with INTERNAL_ERROR', () => {
    const error = {};

    middleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_CODES.INTERNAL_ERROR.status);
    expect(res.json).toHaveBeenCalledWith({
      status: ERROR_CODES.INTERNAL_ERROR.status,
      message: ERROR_CODES.INTERNAL_ERROR.error,
      code: ERROR_CODES.INTERNAL_ERROR.code,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle null or undefined error with INTERNAL_ERROR', () => {
    middleware(null, req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_CODES.INTERNAL_ERROR.status);
    expect(res.json).toHaveBeenCalledWith({
      status: ERROR_CODES.INTERNAL_ERROR.status,
      message: ERROR_CODES.INTERNAL_ERROR.error,
      code: ERROR_CODES.INTERNAL_ERROR.code,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
