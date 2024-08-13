import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/userInterface';


const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);

    next();
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser>('User', UserSchema);

export default User;
