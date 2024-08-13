import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { authToken } from './authController.test';

let taskId: string;

jest.mock('../src/config/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
}));


beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('TaskController', () => {
    describe('POST /tasks', () => {
        it('should create a new task', async () => {
            const res = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    "title": "Task123",
                    "description": "Task123",
                    "status": "in-progress",
                    "priority": "low"
                });

            expect(res.status).toBe(201);
            expect(res.body.title).toBe("Task123")

            taskId = res.body._id;
        });
    });

    describe('GET /tasks', () => {
        it('should return all tasks for the user', async () => {
            const res = await request(app)
                .get('/tasks?page=0&limit=2')
                .set('Authorization', `Bearer ${authToken}`)

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

            if (res.body.length > 0) {
                expect(res.body).toHaveLength(Math.min(2, res.body.length));
            }
        });
    });

    describe('GET /tasks/:id', () => {
        it('should return a task by id', async () => {
            const res = await request(app)
                .get(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${authToken}`)

            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Task123")
        });
    });

    describe('PUT /tasks/:id', () => {
        it('should update a task', async () => {
            const res = await request(app)
                .put(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Updated Task' });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Updated Task")
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should delete a task', async () => {
            const res = await request(app)
                .delete(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${authToken}`)

            expect(res.status).toBe(204);
        });
    });
});
