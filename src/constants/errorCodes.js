export const ERROR_CODES = {
  ER_DUP_ENTRY: {
    status: 400,
    code: 'DUP00001',
    error: 'Duplicated entry',
  },
  UnauthorizedError: {
    status: 401,
    code: 'AUTH00001',
    error: 'Invalid token',
  },
  credentials_required: {
    status: 401,
    code: 'AUTH00001',
    error: 'Credentials required',
  },
  invalid_token: {
    status: 401,
    code: 'AUTH00001',
    error: 'Invalid token',
  },
  INTERNAL_ERROR: {
    status: 500,
    code: 'INTERNAL_ERROR',
    error: 'Something went wrong',
  },
};
