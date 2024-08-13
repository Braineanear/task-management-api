import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { Types } from 'mongoose';
import TaskService from '../services/taskService';
import AppError from '../utils/appError';
import { createTaskSchema, searchTasksSchema, filterTasksSchema } from '../validations/taskValidation';

class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }
    public create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const validatedData = createTaskSchema.parse(req.body);

            const userId = req.user?.id as string;
            const payload = ({ ...validatedData, userId: new Types.ObjectId(userId) });

            const task = await this.taskService.createTask(payload);

            return res.status(201).json(task);
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const message = err.errors.map(e => `${e.path[0]}: ${e.message}`).join(', ');
                return next(new AppError(message, 400));
            }

            return next(new AppError(err.message, 400));
        }
    }

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const userId = req.user?.id as string;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const tasks = await this.taskService.getTasks(userId, page, limit);

            return res.status(200).json(tasks);
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const message = err.errors.map(e => `${e.path[0]}: ${e.message}`).join(', ');
                return next(new AppError(message, 400));
            }

            return next(new AppError(err.message, 400));
        }
    }

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const taskId = req.params.id as string;
            const userId = req.user?.id as string
            const task = await this.taskService.getTaskById(taskId, userId);

            return res.status(200).json(task);
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const message = err.errors.map(e => `${e.path[0]}: ${e.message}`).join(', ');
                return next(new AppError(message, 400));
            }

            return next(new AppError(err.message, 400));
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const taskId = req.params.id as string;
            const userId = req.user?.id as string;
            const payload = req.body;
            const task = await this.taskService.updateTask(taskId, userId, payload);

            return res.status(200).json(task);
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const message = err.errors.map(e => `${e.path[0]}: ${e.message}`).join(', ');
                return next(new AppError(message, 400));
            }

            return next(new AppError(err.message, 400));
        }
    }

    public remove = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const taskId = req.params.id as string;
            const userId = req.user?.id as string;

            await this.taskService.deleteTask(taskId, userId);

            return res.status(204).send();
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const message = err.errors.map(e => `${e.path[0]}: ${e.message}`).join(', ');
                return next(new AppError(message, 400));
            }

            return next(new AppError(err.message, 400));
        }
    }

    public search = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const validatedQuery = searchTasksSchema.parse(req.query);

            const { title } = validatedQuery;
            const userId = req.user?.id as string;
            const tasks = await this.taskService.searchTasks(userId, title as string);

            return res.status(200).json(tasks);
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const message = err.errors.map(e => `${e.path[0]}: ${e.message}`).join(', ');
                return next(new AppError(message, 400));
            }

            return next(new AppError(err.message, 400));
        }
    }

    public filter = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const validatedQuery = filterTasksSchema.parse(req.query);

            const { status, priority } = validatedQuery;
            const userId = req.user?.id as string;
            const tasks = await this.taskService.filterTasks(userId, status, priority);

            return res.status(200).json(tasks);
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const message = err.errors.map(e => `${e.path[0]}: ${e.message}`).join(', ');
                return next(new AppError(message, 400));
            }

            return next(new AppError(err.message, 400));
        }
    }
}

export default new TaskController();
