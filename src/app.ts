import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import errorHandler from './utils/errorHandler';
import connectDB from './config/database';
import { successHandle, errorHandle } from './config/morgan';
import swaggerDocument from './docs/swagger.json';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.enable('trust proxy');
app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(cors());

app.use(successHandle);
app.use(errorHandle);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.all('*', (req, res) => {
  return res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

app.use(errorHandler);

export default app;
