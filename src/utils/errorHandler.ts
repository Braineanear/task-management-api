import { Request, Response, NextFunction } from 'express';
import AppError from './appError';

const { APP_ENV } = process.env;

const handleJWTError = (): AppError =>
  new AppError('Invalid token, Please login again!', 401);

const handleJWTExpiredError = (): AppError =>
  new AppError('Your token has expired! Please login again!', 401);

const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any): AppError => {
  const dupField = Object.keys(err.keyValue)[0];
  const message = `Duplicate field(${dupField}). Please use another value(${err.keyValue[dupField]})!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = async (err: any, req: Request, res: Response): Promise<void> => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = async (err: any, req: Request, res: Response): Promise<void> => {
  console.error('ERROR', err);

  res.status(500).json({
    status: 'error',
    message: `Something went wrong!`,
  });
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error(err.stack);

  if (APP_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (APP_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

export default errorHandler;
