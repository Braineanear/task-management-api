import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';

class AuthMiddleware {
    public checkAuth(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return next(new AppError('You are not logged in! Please login to get access.', 401));
        }

        try {
            const { JWT_SECRET } = process.env;
            const decoded = jwt.verify(token, JWT_SECRET || 'secret') as { id: string };

            req.user = { id: decoded.id };

            next();
        } catch (err) {
            return next(new AppError('You are not logged in! Please login to get access.', 401));
        }
    }
}

export default new AuthMiddleware();
