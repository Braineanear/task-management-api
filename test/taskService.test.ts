import TaskService from '../src/services/taskService';
import Task from '../src/models/task';
import { ITask } from '../src/interfaces/taskInterface';
import { Types } from 'mongoose';

jest.mock('../src/models/task');

describe('TaskService', () => {
    let taskService: TaskService;
    const userId = new Types.ObjectId("66baed47644e20825e851fe6");
    const taskId = new Types.ObjectId("66baed57644e20825e851fea");

    beforeEach(() => {
        taskService = new TaskService();
    });

    describe('createTask', () => {
        it('should create and return a new task', async () => {
            const taskData: Partial<ITask> = { title: 'Test Task', userId };
            const savedTask = { _id: taskId, ...taskData } as ITask;

            (Task.create as jest.Mock).mockResolvedValue(savedTask);

            const result = await taskService.createTask(taskData);

            expect(result).toEqual(savedTask);
        });
    });

    describe('getTasks', () => {
      it('should return a paginated list of tasks', async () => {
          const tasks = [
              { _id: taskId, title: 'Task 1', userId },
              { _id: taskId, title: 'Task 2', userId }
          ] as ITask[];

          (Task.find as jest.Mock).mockReturnValue({
              skip: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue(tasks),
          });

          const result = await taskService.getTasks(userId.toString(), 1, 2);

          expect(Task.find).toHaveBeenCalledWith({ userId: userId.toString() });
          expect(result).toEqual(tasks);
      });
  });


    describe('getTaskById', () => {
        it('should return a task by ID', async () => {
            const task = { _id: taskId, title: 'Test Task', userId } as ITask;

            (Task.findOne as jest.Mock).mockResolvedValue(task);

            const result = await taskService.getTaskById(taskId.toString(), userId.toString());

            expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId.toString(), userId: userId.toString() });
            expect(result).toEqual(task);
        });

        it('should throw an error if task is not found', async () => {
            (Task.findOne as jest.Mock).mockResolvedValue(null);

            await expect(taskService.getTaskById(taskId.toString(), userId.toString())).rejects.toThrow('Task not found');
        });
    });

    describe('updateTask', () => {
        it('should update and return the task', async () => {
            const taskData = { title: 'Updated Task' };
            const updatedTask = { _id: taskId, title: 'Updated Task', userId } as ITask;

            (Task.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

            const result = await taskService.updateTask(taskId.toString(), userId.toString(), taskData);

            expect(Task.findOneAndUpdate).toHaveBeenCalledWith({ _id: taskId.toString(), userId: userId.toString() }, taskData, { new: true });
            expect(result).toEqual(updatedTask);
        });

        it('should throw an error if task is not found', async () => {
            (Task.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(taskService.updateTask(taskId.toString(), userId.toString(), { title: 'Updated Task' })).rejects.toThrow('Task not found');
        });
    });

    describe('deleteTask', () => {
        it('should delete a task by ID', async () => {
            const task = { _id: taskId, title: 'Test Task', userId } as ITask;

            (Task.findOneAndDelete as jest.Mock).mockResolvedValue(task);

            await taskService.deleteTask(taskId.toString(), userId.toString());

            expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: taskId.toString(), userId: userId.toString() });
        });

        it('should throw an error if task is not found', async () => {
            (Task.findOneAndDelete as jest.Mock).mockResolvedValue(null);

            await expect(taskService.deleteTask(taskId.toString(), userId.toString())).rejects.toThrow('Task not found');
        });
    });

    describe('searchTasks', () => {
        it('should return tasks matching the title search', async () => {
            const tasks = [
                { _id: taskId, title: 'Test Task', userId }
            ] as ITask[];

            (Task.find as jest.Mock).mockResolvedValue(tasks);

            const result = await taskService.searchTasks(userId.toString(), 'Test');

            expect(Task.find).toHaveBeenCalledWith({ userId: userId.toString(), title: /Test/i });
            expect(result).toEqual(tasks);
        });
    });

    describe('filterTasks', () => {
        it('should return tasks matching the filter criteria', async () => {
            const tasks = [
                { _id: taskId, title: 'Test Task', userId, status: 'completed', priority: 'high' }
            ] as ITask[];

            (Task.find as jest.Mock).mockResolvedValue(tasks);

            const result = await taskService.filterTasks(userId.toString(), 'completed', 'high');

            expect(Task.find).toHaveBeenCalledWith({ userId: userId.toString(), status: 'completed', priority: 'high' });
            expect(result).toEqual(tasks);
        });
    });
});
