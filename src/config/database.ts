import mongoose from 'mongoose';
import logger from './logger';

const { MONGODB_URL } = process.env;

const connectDB = async () => {

  const con = await mongoose.connect(MONGODB_URL as string);

  logger.info(`MongoDB Connected: ${con.connection.host}.`);

  mongoose.connection.on('connecting', () => {
    logger.info('Connecting to Database');
  });

  mongoose.connection.on('connected', () => {
    logger.info('Mongoose Connected to Database');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(err.message);
  });

  mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose Connection is Disconnected.');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

export default connectDB;
