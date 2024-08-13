import { Request, Response } from 'express';
import morgan, { StreamOptions } from 'morgan';
import logger from './logger';

const { APP_ENV } = process.env;

morgan.token('message', (req: Request, res: Response) => res.locals.errorMessage || '');

const getIpFormat = (): string => (APP_ENV === 'production' ? ':remote-addr - ' : '');

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successStream: StreamOptions = {
  write: (message: string) => logger.info(message.trim()),
};

const errorStream: StreamOptions = {
  write: (message: string) => logger.error(message.trim()),
};

export const successHandle = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: successStream,
});

export const errorHandle = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: errorStream,
});
