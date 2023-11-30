import request from 'supertest';
import { app } from '../../app.js';

// ChatGPT usage: NO
describe('Testing Server Landing Page', () => {
    test('Welcome message GET /', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Welcome to RunIO');
    });
});


// import {jest} from '@jest/globals'
// import * as turf from "@turf/turf";
// import { pathToPolygon } from '../../helpers/run.js';

// jest.mock('mongodb');

// // ChatGPT usage: NO
// // Interface: NA
// describe('Testing Run Helpers', () => {
//     test('pathToPolygon with valid coordinates', async () => {
//         const path = [
//             {"latitude": 125.0, "longitude": -15.0},
//             {"latitude": 113.0, "longitude": -22.0},
//             {"latitude": 154.0, "longitude": -27.0},
//             {"latitude": 125.0, "longitude": -15.0}
//         ];
//         const final_polygon = turf.polygon([[[125.0, -15.0], [113.0, -22.0], [154.0, -27.0], [125.0, -15.0]]]);
//         const result = pathToPolygon(path);
//         expect(result).toStrictEqual(final_polygon);
//     });

//     test('pathToPolygon with invalid coordinates', async () => {
//         const path = [
//             {"latitude": 125.0, "longitude": -15.0},
//             {"BAD COORDINATE": 115.0, "longitude": -23.0},
//             {"latitude": 113.0, "longitude": -22.0},
//             {"latitude": 154.0, "longitude": -27.0},
//             {"latitude": 125.0, "longitude": -15.0}
//         ];
//         const final_polygon = turf.polygon([[[125.0, -15.0], [113.0, -22.0], [154.0, -27.0], [125.0, -15.0]]]);
//         const result = pathToPolygon(path);
//         expect(result).toStrictEqual(final_polygon);
//     });
// });