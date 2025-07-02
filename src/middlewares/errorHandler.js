// eslint-disable-next-line no-unused-vars
export const errorHandlerMiddleware = (errorCodes) => (err, req, res, next) => {
  const errorCode = err?.code || err?.name;
  const errorObject = errorCodes[errorCode] || errorCodes.INTERNAL_ERROR;
  console.log(err);
  return res.status(errorObject.status).json({
    status: errorObject.status,
    message: errorObject.error,
    code: errorObject.code,
  });
};
