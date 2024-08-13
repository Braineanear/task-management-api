import { Types, Document } from 'mongoose';
import { StatusEnum, PriorityEnum } from '../enums/taskEnum';

export interface ITask extends Document {
  title: string;
  description?: string;
  status?: StatusEnum;
  priority?: PriorityEnum;
  dueDate?: Date;
  userId: Types.ObjectId;
}
