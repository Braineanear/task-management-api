import { PriorityEnum, StatusEnum } from '../enums/taskEnum';
import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.nativeEnum(StatusEnum).optional(),
    priority: z.nativeEnum(PriorityEnum).optional(),
    dueDate: z.string().transform((str) => new Date(str)).optional()
});

export const searchTasksSchema = z.object({
    title: z.string().optional(),
});

export const filterTasksSchema = z.object({
    status: z.enum(['pending', 'in-progress', 'completed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
});
