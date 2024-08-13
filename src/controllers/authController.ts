import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import AuthService from '../services/authService';
import AppError from '../utils/appError';
import { registerUserSchema, loginUserSchema } from '../validations/authValidation';

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const validatedData = registerUserSchema.parse(req.body);
            const { username, password } = validatedData;

            const user = await this.authService.registerUser(username, password);

            return res.status(201).json(user);
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const message = err.errors.map(e => `${e.path[0]}: ${e.message}`).join(', ');
                return next(new AppError(message, 400));
            }

            return next(new AppError(err.message, 400));
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const validatedData = loginUserSchema.parse(req.body);
            const { username, password } = validatedData;

            const { user, token } = await this.authService.loginUser(username, password);

            return res.status(200).json({ user, token });
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const message = err.errors.map(e => `${e.path[0]}: ${e.message}`).join(', ');
                return next(new AppError(message, 400));
            }

            return next(new AppError(err.message, 400));
        }
    }
}

export default new AuthController();
