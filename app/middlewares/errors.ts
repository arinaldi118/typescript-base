import { Response, NextFunction } from 'express';

import * as errors from '../errors';
import logger from '../logger';

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.DATABASE_ERROR]: 503,
  [errors.DEFAULT_ERROR]: 500,
  [errors.NOT_FOUND]: 404
};

export const handle = (
  error: { internalCode: string | number; message: any },
  _: any,
  res: Response,
  next: NextFunction
) => {
  if (error.internalCode) {
    res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  } else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
