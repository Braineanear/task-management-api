import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IUser } from '../interfaces/userInterface';

class AuthService {
    private jwtSecret: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET as string;
    }

    public registerUser = async (username: string, password: string): Promise<IUser> => {
        const user = new User({ username, password });
        await user.save();

        user.password = undefined;

        return user;
    }

    public loginUser = async (username: string, password: string): Promise<{ user: IUser, token: string }> => {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Username or password might be wrong! try again!');
        }

        const token = jwt.sign({ id: user._id }, this.jwtSecret, {
            expiresIn: '1h',
        });

        user.password = undefined;

        return { user, token };
    }
}

export default AuthService;
