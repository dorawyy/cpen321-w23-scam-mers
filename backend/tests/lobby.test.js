import {jest} from '@jest/globals'
import request from 'supertest';
import { app, lobbiesCollection, playersCollection } from '../app.js';

jest.mock('mongodb');

// Interface POST /lobby
describe('Testing POST Lobby Endpoint', () => {
  test('Post new lobby', async () => {
    const lobbyLeaderId = "000000000000000000000000"
    const lobbyData = {
    "lobbyName": "Test Lobby",
    "lobbyLeaderId": lobbyLeaderId,
    "playerSet": {
            [lobbyLeaderId]: {
            "distanceCovered": 0.0,
            "totalArea": 0.0,
            "lands": [],
            }
        }
    }
    const newLobbyId = '000000000000000000000001'

    const mockedInsertOneLobby = jest.fn().mockReturnValue({'insertedId': newLobbyId});
    const mockedUpdatetOnePlayer = jest.fn().mockReturnValue(null);
    jest.spyOn(lobbiesCollection, 'insertOne').mockImplementation(mockedInsertOneLobby);
    jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdatetOnePlayer);
    const response = await request(app)
        .post(`/lobby`)
        .send(lobbyData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({message: "Created new lobby", _id: newLobbyId});
  });

  test('Post new lobby with invalid lobbyData', async () => {
    const mockedInsertOneLobby = jest.fn().mockReturnValue(null);
    const mockedUpdatetOnePlayer = jest.fn().mockReturnValue(null);
    jest.spyOn(lobbiesCollection, 'insertOne').mockImplementation(mockedInsertOneLobby);
    jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdatetOnePlayer);
    const response = await request(app).post(`/lobby`).send({
        "lobbyName": "Test Lobby",
        "lobbyLeaderId": "000000000000000000000000"});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Insufficient lobby data' });
  });

  test('Post new lobby with server error', async () => {
    const lobbyLeaderId = "000000000000000000000000"
    const lobbyData = {
    "lobbyName": "Test Lobby",
    "lobbyLeaderId": lobbyLeaderId,
    "playerSet": {
            [lobbyLeaderId]: {
            "distanceCovered": 0.0,
            "totalArea": 0.0,
            "lands": [],
            }
        }
    }
    const newLobbyId = '000000000000000000000001'

    const mockedInsertOneLobby = jest.fn(() => {
        throw new Error('Mocked error');
    });
    const mockedUpdatetOnePlayer = jest.fn(() => {
        throw new Error('Mocked error');
    });
    jest.spyOn(lobbiesCollection, 'insertOne').mockImplementation(mockedInsertOneLobby);
    jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdatetOnePlayer);
    const response = await request(app)
        .post(`/lobby`)
        .send(lobbyData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Server error' });
  });
});

// Interface GET /lobby/:lobbyId
describe('Testing GET Lobby Endpoint', () => {
    test('Get lobby', async () => {
        const lobbyId = "000000000000000000000000"
        const lobbyData = {
            "_id": lobbyId,
            "availableColors": [
                -8452552,
                -10596446,
                -10701928,
                -12632257,
                -658873,
                -892141,
                -1486101,
                -8848794,
                -13465411
            ],
            "lobbyName": "Test Lobby",
            "lobbyLeaderId": "000000000000000000000001",
            "playerSet": {
                "000000000000000000000001": {
                    "distanceCovered": 0,
                    "totalArea": 0,
                    "lands": [],
                    "color": -2290138
                }
            }
        }
        const mockedFindOne = jest.fn().mockReturnValue(lobbyData);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}`)
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(lobbyData);
    });

    test('Get lobby that does not exist', async () => {
        const lobbyId = "000000000000000000000000"
        const mockedFindOne = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}`)
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Lobby not found' });
    });

    test('Get lobby with invalid lobby id', async () => {
        const lobbyId = "00000000000000000000000Z"
        const mockedFindOne = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}`)
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Lobby Id is invalid' });
    });

    test('Get lobby with server error', async () => {
        const lobbyId = "000000000000000000000000"
        const mockedFindOne = jest.fn(() => {
            throw new Error('Mocked error');
        });
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}`)
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'Server error' });
    });
});

// Interface GET /lobby/:lobbyId/lobbyName
describe('Testing GET Lobby Name Endpoint', () => {
    test('Get lobby name', async () => {
        const lobbyId = "000000000000000000000000"
        const lobbyData = {
            "lobbyName": "Test Lobby"
        }
        const mockedFindOne = jest.fn().mockReturnValue(lobbyData);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}/lobbyName`)
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(lobbyData);
    });

    test('Get lobby name that does not exist', async () => {
        const lobbyId = "000000000000000000000000"
        const mockedFindOne = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}/lobbyName`)
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Lobby not found' });
    });

    test('Get lobby name with invalid lobby id', async () => {
        const lobbyId = "00000000000000000000000Z"
        const mockedFindOne = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}/lobbyName`)
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Lobby Id is invalid' });
    });

    test('Get lobby name with server error', async () => {
        const lobbyId = "000000000000000000000000"
        const mockedFindOne = jest.fn(() => {
            throw new Error('Mocked error');
        });
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}/lobbyName`)
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'Server error' });
    });
});

// Interface PUT /lobby/:lobbyId/player/:playerId
describe('Testing PUT Player into a Lobby Endpoint', () => {
    test('Put player into lobby', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const playerStats = {
            "distanceCovered": 0,
            "totalArea": 0,
            "lands": [],
            "color": -2290138
        };

        const lobbyData = {playerSet: {}, availableColors: [-2290138]}
        const playerData = {lobbySet: {}}

        const mockedFindOneLobby = jest.fn().mockReturnValue(lobbyData);
        const mockedFindOnePlayer = jest.fn().mockReturnValue(playerData);
        const mockedUpdateOneLobby = jest.fn().mockReturnValue(null);
        const mockedUpdateOnePlayer = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
        jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOnePlayer);
        jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOneLobby);
        jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOnePlayer);
        const response = await request(app)
        .put(`/lobby/${lobbyId}/player/${playerId}`)
        .send(playerStats)
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({message: "Player added"});
    });

    test('Put player into lobby they are already in', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const playerStats = {
            "distanceCovered": 0.0,
            "totalArea": 0.0,
            "lands": [],
            "color": -2290138
        };

        const lobbyData = {playerSet: {
            [playerId]: 
            {
                distanceCovered: 0.0,
                totalArea: 0.0,
                lands: [],
                color: -8452552
            }
        }, availableColors: [-2290138]}
        const playerData = {lobbySet: [lobbyId]}

        const mockedFindOneLobby = jest.fn().mockReturnValue(lobbyData);
        const mockedFindOnePlayer = jest.fn().mockReturnValue(playerData);
        const mockedUpdateOneLobby = jest.fn().mockReturnValue(null);
        const mockedUpdateOnePlayer = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
        jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOnePlayer);
        jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOneLobby);
        jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOnePlayer);
        const response = await request(app)
        .put(`/lobby/${lobbyId}/player/${playerId}`)
        .send(playerStats)
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({message: "This player is already a member of this lobby"});
    });

    test('Put player into lobby with invalid playerStats', async () => {
        const lobbyId = "00000000000000000000000Z"
        const playerId = "0000000000000000000000Z1"
        const playerStats = {}

        const mockedFindOneLobby = jest.fn().mockReturnValue(null);
        const mockedFindOnePlayer = jest.fn().mockReturnValue(null);
        const mockedUpdateOneLobby = jest.fn().mockReturnValue(null);
        const mockedUpdateOnePlayer = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
        jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOnePlayer);
        jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOneLobby);
        jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOnePlayer);
        const response = await request(app)
        .put(`/lobby/${lobbyId}/player/${playerId}`)
        .send(playerStats)
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Missing parameters' });
    });

    test('Put non-existent player into lobby', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const playerStats = {
            "distanceCovered": 0,
            "totalArea": 0,
            "lands": [],
            "color": -2290138
        };

        const lobbyData = {playerSet: {}, availableColors: [-2290138]}
        const playerData = {lobbySet: {}}

        const mockedFindOneLobby = jest.fn().mockReturnValue(null);
        const mockedFindOnePlayer = jest.fn().mockReturnValue(null);
        const mockedUpdateOneLobby = jest.fn().mockReturnValue(null);
        const mockedUpdateOnePlayer = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
        jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOnePlayer);
        jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOneLobby);
        jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOnePlayer);
        const response = await request(app)
        .put(`/lobby/${lobbyId}/player/${playerId}`)
        .send(playerStats)
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Player or lobby not found' });
    });

    test('Put player into lobby with server error', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const playerStats = {
            "distanceCovered": 0,
            "totalArea": 0,
            "lands": [],
            "color": -2290138
        };

        const lobbyData = {playerSet: {}, availableColors: [-2290138]}
        const playerData = {lobbySet: {}}

        const mockedFindOneLobby = jest.fn(() => {
            throw new Error('Mocked error');
        });
        const mockedFindOnePlayer = jest.fn(() => {
            throw new Error('Mocked error');
        });
        const mockedUpdateOneLobby = jest.fn(() => {
            throw new Error('Mocked error');
        });
        const mockedUpdateOnePlayer = jest.fn(() => {
            throw new Error('Mocked error');
        });
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
        jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOnePlayer);
        jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOneLobby);
        jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOnePlayer);
        const response = await request(app)
        .put(`/lobby/${lobbyId}/player/${playerId}`)
        .send(playerStats)
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'Server error' });
    });
});