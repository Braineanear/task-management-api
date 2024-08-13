import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import app from './app';
import logger from './config/logger';

const { PORT } = process.env;

app.listen(PORT, () => {
  logger.info(`Server listening on port: ${PORT}`);
});
