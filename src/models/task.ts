import { Schema, model } from 'mongoose';
import { ITask } from '../interfaces/taskInterface';
import { StatusEnum, PriorityEnum } from '../enums/taskEnum';

const TaskSchema: Schema<ITask> = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: Object.values(StatusEnum), default: StatusEnum.PENDING },
    priority: { type: String, enum: Object.values(PriorityEnum), default: PriorityEnum.MEDIUM },
    dueDate: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Task = model<ITask>('Task', TaskSchema);

export default Task;
