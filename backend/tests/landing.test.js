import request from 'supertest';
import { app, } from '../app.js';

// ChatGPT usage: NO
describe('Testing Server Landing Page', () => {
    test('Welcome message GET /', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Welcome to RunIO');
    });
});