import {jest} from '@jest/globals'
import request from 'supertest';
import { app } from '../../app.js';
import { lobbiesCollection, playersCollection } from '../../helpers/mongodb.js';

jest.mock('mongodb');

// ChatGPT usage: NO
// Interface POST /lobby
describe('Testing POST Lobby Endpoint', () => {
// ChatGPT usage: NO
  test('Post new lobby', async () => {
    const lobbyLeaderId = "000000000000000000000000"
    const lobbyData = {
    "lobbyName": "Test Lobby",
    "lobbyLeaderId": lobbyLeaderId,
    "playerSet": {
            [lobbyLeaderId]: {
            "playerName": "John Doe",
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
// ChatGPT usage: NO
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
// ChatGPT usage: NO
  test('Post new lobby with server error', async () => {
    const lobbyLeaderId = "000000000000000000000000"
    const lobbyData = {
    "lobbyName": "Test Lobby",
    "lobbyLeaderId": lobbyLeaderId,
    "playerSet": {
        [lobbyLeaderId]: {
        "playerName": "John Doe",
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

// ChatGPT usage: NO
// Interface GET /lobby/:lobbyId
describe('Testing GET Lobby Endpoint', () => {
    // ChatGPT usage: NO
    test('Get lobby', async () => {
        const lobbyId = "000000000000000000000000"
        const lobbyData = {
            "_id": lobbyId,
            "availableColors": [
                -845255,
                -105964,
                -107019,
                -126322,
                -658873,
                -892141,
                -148610,
                -884879,
                -134652
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
// ChatGPT usage: NO
    test('Get lobby that does not exist', async () => {
        const lobbyId = "000000000000000000000000"
        const mockedFindOne = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}`)
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Lobby not found' });
    });
// ChatGPT usage: NO
    test('Get lobby with invalid lobby id', async () => {
        const lobbyId = "00000000000000000000000Z"
        const mockedFindOne = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}`)
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Lobby Id is invalid' });
    });
// ChatGPT usage: NO
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

// ChatGPT usage: NO
// Interface GET /lobby/:lobbyId/lobbyName
describe('Testing GET Lobby Name Endpoint', () => {
    // ChatGPT usage: NO
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
// ChatGPT usage: NO
    test('Get lobby name that does not exist', async () => {
        const lobbyId = "000000000000000000000000"
        const mockedFindOne = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}/lobbyName`)
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Lobby not found' });
    });
// ChatGPT usage: NO
    test('Get lobby name with invalid lobby id', async () => {
        const lobbyId = "00000000000000000000000Z"
        const mockedFindOne = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOne);
        const response = await request(app).get(`/lobby/${lobbyId}/lobbyName`)
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Lobby Id is invalid' });
    });
// ChatGPT usage: NO
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

// ChatGPT usage: NO
// Interface PUT /lobby/:lobbyId/player/:playerId
describe('Testing PUT Player into a Lobby Endpoint', () => {
    // ChatGPT usage: NO
    test('Put player into lobby', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const playerStats = {
            "playerName": "John Doe",
            "distanceCovered": 0,
            "totalArea": 0,
            "lands": [],
            "color": -2290138
        };

        const lobbyData = {playerSet: {}, availableColors: [-2290138]}
        const playerData = {lobbySet: []}

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
// ChatGPT usage: NO
    test('Put player into lobby they are already in', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const playerStats = {
            "playerName": "John Doe",
            "distanceCovered": 0,
            "totalArea": 0,
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
// ChatGPT usage: NO
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
// ChatGPT usage: NO
    test('Put non-existent player into lobby', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const playerStats = {
            "playerName": "John Doe",
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
// ChatGPT usage: NO
    test('Put player into lobby with server error', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const playerStats = {
            "playerName": "John Doe",
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

// ChatGPT usage: NO
// Interface DELETE /lobby/:lobbyId/player/:playerId
describe('Testing DELETE Player from a Lobby Endpoint', () => {
    // ChatGPT usage: NO
    test('Delete player from lobby', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const lobbyLeaderId = "000000000000000000000002"

        const lobbyData = {
            lobbyLeaderId: lobbyLeaderId, 
            playerSet: {
                "000000000000000000000001": {color: 1000}, 
                "000000000000000000000002": {color: 2000}}, 
            availableColors: [-2290138]}
        const playerData = {lobbySet: ["000000000000000000000000"]}

        const mockedFindOneLobby = jest.fn().mockReturnValue(lobbyData);
        const mockedFindOnePlayer = jest.fn().mockReturnValue(playerData);
        const mockedUpdateOneLobby = jest.fn().mockReturnValue(null);
        const mockedUpdateOnePlayer = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
        jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOnePlayer);
        jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOneLobby);
        jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOnePlayer);
        const response = await request(app)
        .delete(`/lobby/${lobbyId}/player/${playerId}`)
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({message: "Player removed"});
    });
// ChatGPT usage: NO
    test('Delete player from lobby they are not in', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const lobbyLeaderId = "000000000000000000000002"

        const lobbyData = {
            lobbyLeaderId: lobbyLeaderId, 
            playerSet: {
                "000000000000000000000002": {color: 2000}}, 
            availableColors: [-2290138]}
        const playerData = {lobbySet: []}

        const mockedFindOneLobby = jest.fn().mockReturnValue(lobbyData);
        const mockedFindOnePlayer = jest.fn().mockReturnValue(playerData);
        const mockedUpdateOneLobby = jest.fn().mockReturnValue(null);
        const mockedUpdateOnePlayer = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
        jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOnePlayer);
        jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOneLobby);
        jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOnePlayer);
        const response = await request(app)
        .delete(`/lobby/${lobbyId}/player/${playerId}`)
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({message: "This player is not a member of the lobby"});
    });
// ChatGPT usage: NO
    test('Delete player from lobby with invalid lobbyId', async () => {
        const lobbyId = "00000000000000000000000Z"
        const playerId = "000000000000000000000001"
        const lobbyLeaderId = "000000000000000000000002"

        const lobbyData = {
            lobbyLeaderId: lobbyLeaderId, 
            playerSet: {
                "000000000000000000000001": {color: 1000}, 
                "000000000000000000000002": {color: 2000}}, 
            availableColors: [-2290138]}
        const playerData = {lobbySet: ["000000000000000000000000"]}

        const mockedFindOneLobby = jest.fn().mockReturnValue(null);
        const mockedFindOnePlayer = jest.fn().mockReturnValue(null);
        const mockedUpdateOneLobby = jest.fn().mockReturnValue(null);
        const mockedUpdateOnePlayer = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
        jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOnePlayer);
        jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOneLobby);
        jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOnePlayer);
        const response = await request(app)
        .delete(`/lobby/${lobbyId}/player/${playerId}`)
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Missing parameters' });
    });

    // ChatGPT usage: NO
    test('Delete lobby leader from lobby', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const lobbyLeaderId = "000000000000000000000002"

        const lobbyData = {
            lobbyLeaderId: lobbyLeaderId, 
            playerSet: {
                "000000000000000000000001": {color: 1000}, 
                "000000000000000000000002": {color: 2000}}, 
            availableColors: [-2290138]}
        const playerData = {lobbySet: ["000000000000000000000000"]}

        const mockedFindOneLobby = jest.fn().mockReturnValue(lobbyData);
        const mockedFindOnePlayer = jest.fn().mockReturnValue(playerData);
        const mockedUpdateOneLobby = jest.fn().mockReturnValue(null);
        const mockedUpdateOnePlayer = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
        jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOnePlayer);
        jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOneLobby);
        jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOnePlayer);
        const response = await request(app)
        .delete(`/lobby/${lobbyId}/player/${lobbyLeaderId}`)
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({error: "Removing lobby leader is not supported"});
    });
// ChatGPT usage: NO
    test('Delete non-existent player from lobby', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const lobbyLeaderId = "000000000000000000000002"

        const lobbyData = {
            lobbyLeaderId: lobbyLeaderId, 
            playerSet: {
                "000000000000000000000001": {color: 1000}, 
                "000000000000000000000002": {color: 2000}}, 
            availableColors: [-2290138]}
        const playerData = {lobbySet: ["000000000000000000000000"]}

        const mockedFindOneLobby = jest.fn().mockReturnValue(null);
        const mockedFindOnePlayer = jest.fn().mockReturnValue(null);
        const mockedUpdateOneLobby = jest.fn().mockReturnValue(null);
        const mockedUpdateOnePlayer = jest.fn().mockReturnValue(null);
        jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
        jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOnePlayer);
        jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOneLobby);
        jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOnePlayer);
        const response = await request(app)
        .delete(`/lobby/${lobbyId}/player/${playerId}`)
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Player or lobby not found' });
    });
// ChatGPT usage: NO
    test('Delete player from lobby with server error', async () => {
        const lobbyId = "000000000000000000000000"
        const playerId = "000000000000000000000001"
        const lobbyLeaderId = "000000000000000000000002"

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
        .delete(`/lobby/${lobbyId}/player/${playerId}`)
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'Server error' });
    });
});