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
  LICENSE_PLATE_NOT_FOUND: {
    status: 400,
    code: 'LICENSE_PLATE_NOT_FOUND',
    error: 'License plate not found',
  },
  CAR_NOT_FOUND: {
    status: 400,
    code: 'CAR_NOT_FOUND',
    error: 'Car not found',
  },
  SERVICE_ORDER_NOT_FOUND: {
    status: 400,
    code: 'SERVICE_ORDER_NOT_FOUND',
    error: 'Service order not found',
  },
};
