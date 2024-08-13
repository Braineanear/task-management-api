import AuthService from '../src/services/authService';
import User from '../src/models/user';
import jwt from 'jsonwebtoken';
import { IUser } from '../src/interfaces/userInterface';

jest.mock('../src/models/user');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
    });

    describe('registerUser', () => {
      it('should create a new user and return it without password', async () => {
          const userData = { username: 'testuser', password: 'testpassword' };
          const savedUser = { _id: 'userId', username: 'testuser' };

          (User.create as jest.Mock).mockResolvedValue(savedUser);

          const result = await authService.registerUser(userData.username, userData.password);

          expect(User.create).toHaveBeenCalledWith(userData);
          expect(result).toEqual({
              _id: 'userId',
              username: 'testuser'
          });
          expect(result.password).toBeUndefined();
      });
    });

    describe('loginUser', () => {
        it('should return a user and a token if login is successful', async () => {
            const userData = { _id: 'userId', username: 'testuser', password: 'testpassword', comparePassword: jest.fn().mockResolvedValue(true) };
            const token = 'testtoken';

            (User.findOne as jest.Mock).mockResolvedValue(userData);
            (jwt.sign as jest.Mock).mockReturnValue(token);

            const result = await authService.loginUser(userData.username, userData.password);

            expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
            expect(userData.comparePassword).toHaveBeenCalledWith('testpassword');
            expect(jwt.sign).toHaveBeenCalledWith({ id: 'userId' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            expect(result).toEqual({ user: expect.objectContaining({ username: 'testuser' }), token });
        });

        it('should throw an error if the username or password is incorrect', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(authService.loginUser('wronguser', 'wrongpassword')).rejects.toThrow('Username or password might be wrong! try again!');
        });
    });
});
