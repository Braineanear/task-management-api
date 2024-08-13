import Task from '../models/task';
import { ITask } from '../interfaces/taskInterface';

class TaskService {
    public createTask = async (taskData: Partial<ITask>): Promise<ITask> => {
        const task = new Task(taskData);

        await task.save();

        return task;
    }

    public getTasks = async (userId: string, page: number, limit: number): Promise<ITask[]> => {
        const tasks = await Task.find({ userId })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        return tasks;
    }

    public getTaskById = async (id: string, userId: string): Promise<ITask> => {
        const task = await Task.findOne({ _id: id, userId });

        if (!task) throw new Error('Task not found');

        return task;
    }

    public updateTask = async (id: string, userId: string, taskData: Partial<ITask>): Promise<ITask> => {
        const task = await Task.findOneAndUpdate({ _id: id, userId }, taskData, { new: true });

        if (!task) throw new Error('Task not found');

        return task;
    }

    public deleteTask = async (id: string, userId: string): Promise<void> => {
        const task = await Task.findOneAndDelete({ _id: id, userId });

        if (!task) throw new Error('Task not found');
    }

    public searchTasks = async (userId: string, title: string): Promise<ITask[]> => {
        const tasks = await Task.find({ userId, title: new RegExp(title, 'i') });

        return tasks;
    }

    public filterTasks = async (userId: string, status?: string, priority?: string): Promise<ITask[]> => {
        const query: any = { userId };

        if (status) query.status = status;
        if (priority) query.priority = priority;

        const tasks = await Task.find(query);

        return tasks;
    }
}

export default TaskService;
