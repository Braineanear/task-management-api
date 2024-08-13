import request from 'supertest';
import app from '../src/app';
import { v4 as uuidv4 } from 'uuid';

let authToken: string;
let username: string;
let password: string;

jest.mock('../src/config/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
}));


beforeAll(() => {
    password = 'password123';
    username = `user-${uuidv4()}`;
    jest.spyOn(console, 'error').mockImplementation(() => {});
});


describe('AuthController', () => {
  describe('POST /auth/register', () => {
    it('should register a user successfully', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ username, password });

        expect(res.status).toBe(201);
        expect(res.body.username).toBe(username);
      });

      it('should return validation error if data is invalid', async () => {
        const res = await request(app)
          .post('/auth/register')
          .send({
            username: '',
            password: 'testpassword',
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("username: Username must be at least 3 characters long");
      });
    });

    describe('POST /auth/login', () => {
      it('should login an existing user', async () => {
        const res = await request(app)
          .post('/auth/login')
          .send({ username, password });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        authToken = res.body.token;
      });

      it('should return error for invalid login credentials', async () => {
        const res = await request(app)
          .post('/auth/login')
          .send({
            username: 'wronguser',
            password: 'wrongpassword',
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Username or password might be wrong! try again!");
      });
    });
  });

export { authToken };
