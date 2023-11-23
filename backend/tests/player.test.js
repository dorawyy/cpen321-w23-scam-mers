import {jest} from '@jest/globals'
import request from 'supertest';
import { app, client, playersCollection } from '../app.js';
import { MongoClient } from 'mongodb';

jest.mock('mongodb');

// ChatGPT usage: NO
// Interface GET /player/:player
describe('Testing GET Player Endpoint', () => {
// ChatGPT usage: NO
  // Input: goelsrijan99@gmail.com playerEmail that exists
  // Expected status code: 200
  // Expected behavior: database is unchanged
  // Expected output: existing player is returned
  test('Get player by email', async () => {
    const playerEmail = 'johndoe@gmail.com';
    const mockedPlayer = { "_id": "testID",
      "lobbySet": [],
      "playerEmail": playerEmail,
      "playerDisplayName": "John Doe",
      "playerPhotoUrl": "testurl.com",
      "totalAreaRan": 0.0,
      "totalDistanceRan": 0.0,
      "fcmToken": "testToken"
    }

    const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
    jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    const response = await request(app).get(`/player/${playerEmail}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockedPlayer);
  });
// ChatGPT usage: NO
  // Input: 65420eab8416de2e55a111b2 playerId that exists
  // Expected status code: 200
  // Expected behavior: database is unchanged
  // Expected output: existing player is returned
  test('Get player by ID', async () => {
    const playerId = '00000eab0000de2e55a111b2';
    const mockedPlayer = { "_id": playerId,
      "lobbySet": [],
      "playerEmail": "test@gmail.com",
      "playerDisplayName": "John Doe",
      "playerPhotoUrl": "testurl.com",
      "totalAreaRan": 0.0,
      "totalDistanceRan": 0.0,
      "fcmToken": "testToken"
    }
    const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
    jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);

    const response = await request(app).get(`/player/${playerId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockedPlayer);
  });
// ChatGPT usage: NO
  // Input: 2a playerId that is not valid
  // Expected status code: 400
  // Expected behavior: database is unchanged
  // Expected output: invalid player email or id message
  test('Invalid player id request', async () => {
    const playerId = '2a';
    const mockedPlayer = null
    const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
    jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    const response = await request(app).get(`/player/${playerId}`);
    expect(response.statusCode).toBe(400);
  });
// ChatGPT usage: NO
  // Input: something@gamil.com playerEmail that doesn't exist
  // Expected status code: 404
  // Expected behavior: database is unchanged
  // Expected output: player not found error message
  test('Player not found', async () => {
    const playerId = 'some@gmail.com';
    const mockedPlayer = null
    const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
    jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    const response = await request(app).get(`/player/${playerId}`);
    expect(response.statusCode).toBe(404);
  });
// ChatGPT usage: NO
  // Input: servor error
  // Expected status code: 500
  // Expected behavior: database is unchanged
  // Expected output: server error
  test('server error', async () => {
    const playerId = 'some@gmail.com';
    const mockedFindOne = jest.fn(() => {
      throw new Error('Mocked error');
    });
    jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    const response = await request(app).get(`/player/${playerId}`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Server error' });
  });

});

// ChatGPT usage: NO
// Interface PUT /player/:playerEmail
describe('Testing PUT Player Endpoint', () => {
// ChatGPT usage: NO
  // Input: johndoe@gmail.com playerEmail that exists
  // Expected status code: 200
  // Expected behavior: player in database updated
  // Expected output: player updated message returned
  test('PUT player by existing email', async () => {
    const playerEmail = 'johndoe@gmail.com';
    const playerData = { "_id": "000000000000000000000000",
      "lobbySet": ["testlobby1"],
      "playerEmail": playerEmail,
      "playerDisplayName": "John Doe",
      "playerPhotoUrl": "testurl.com",
      "totalAreaRan": 0.0,
      "totalDistanceRan": 0.0,
      "fcmToken": "testToken"
    }
    const mockedPlayer = { "_id": "000000000000000000000000",
      "lobbySet": [],
      "playerEmail": playerEmail,
      "playerDisplayName": "John Doe",
      "playerPhotoUrl": "testurl.com",
      "totalAreaRan": 0.0,
      "totalDistanceRan": 0.0,
      "fcmToken": "testToken"
    }
    const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
    jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    const mockedUpdateOne = jest.fn().mockReturnValue(null);
    jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOne);
    const response = await request(app).put(`/player/${playerEmail}`).send(playerData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({message: "Updated existing player"});
  });
// ChatGPT usage: NO
  // Input: johndoe2@gmail.com playerEmail that doesn't exist
  // Expected status code: 201
  // Expected behavior: player added in database
  // Expected output: created new player message returned
  test('PUT player by new email', async () => {
    const playerEmail = 'johndoe2@gmail.com';
    const playerId = "000000000000000000000000";
    const playerData = { 
      "lobbySet": [],
      "playerEmail": playerEmail,
      "playerDisplayName": "John Doe",
      "playerPhotoUrl": "testurl.com",
      "totalAreaRan": 0.0,
      "totalDistanceRan": 0.0,
      "fcmToken": "testToken"
    }
    const mockedFindOne = jest.fn().mockReturnValue(null);
    jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    const mockedInsertOne = jest.fn().mockReturnValue({'insertedId': playerId});
    jest.spyOn(playersCollection, 'insertOne').mockImplementation(mockedInsertOne);
    const response = await request(app).put(`/player/${playerEmail}`).send(playerData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({message: "Created new player", _id: playerId});
  });
// ChatGPT usage: NO
  // Input: invalid id
  // Expected status code: 500
  // Expected behavior: no change in database
  // Expected output: server error
  test('PUT player server error', async () => {
    const playerEmail = 'johndoe3@gmail.com';
    const playerData = {
      "lobbySet": [],
      "playerEmail": playerEmail,
      "playerDisplayName": "John Doe",
      "playerPhotoUrl": "testurl.com",
      "totalAreaRan": 0.0,
      "totalDistanceRan": 0.0,
      "fcmToken": "testToken"
    }
    const mockedFindOne = jest.fn(() => {
      throw new Error('Mocked error');
    });
    jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    const response = await request(app).put(`/player/${playerEmail}`).send(playerData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Server error' });
  });

});

// ChatGPT usage: NO
// Interface PUT /player/:playerEmail/fcmToken/:fcmToken
describe('Testing PUT Player FCM Token Endpoint', () => {
// ChatGPT usage: NO
  // Input: 000000000000000000000000 playerId that exists
  // Expected status code: 200
  // Expected behavior: player in database updated
  // Expected output: Updated player fcmToken
  test('PUT player FCM Token existing playerId', async () => {
    const playerId = "000000000000000000000000";
    const fcmToken = "fcmtoken";
    const mockedPlayer = { "_id": playerId,
      "lobbySet": [],
      "playerEmail": 'johndoe@gmail.com',
      "playerDisplayName": "John Doe",
      "playerPhotoUrl": "testurl.com",
      "totalAreaRan": 0.0,
      "totalDistanceRan": 0.0,
      "fcmToken": "testToken"
    }
    const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
    jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    const mockedUpdateOne = jest.fn().mockReturnValue(mockedPlayer);
    jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOne);
    const response = await request(app).put(`/player/${playerId}/fcmToken/${fcmToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({message: "Updated player fcmToken"});
  });
// ChatGPT usage: NO
  // Input: 000000000000000000000001 playerId that doesn't exist
  // Expected status code: 404
  // Expected behavior: no change in database
  // Expected output: player not found
  test('PUT player FCM Token playerId doesnt exist', async () => {
    const playerId = "000000000000000000000001";
    const fcmToken = "fcmtoken";
    const mockedFindOne = jest.fn().mockReturnValue(null);
    jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    const response = await request(app).put(`/player/${playerId}/fcmToken/${fcmToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: 'player not found' });
  });
// ChatGPT usage: NO
  // Input: 1 invalid playerId
  // Expected status code: 400
  // Expected behavior: no change in database
  // Expected output: Insufficient or invalid player data fields
  test('PUT player FCM Token invalid playerId', async () => {
    const playerId = "1";
    const fcmToken = "fcmtoken";
    const response = await request(app).put(`/player/${playerId}/fcmToken/${fcmToken}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Insufficient or invalid player data fields' });
  });
// ChatGPT usage: NO
  // Input: server error
  // Expected status code: 500
  // Expected behavior: no change in database
  // Expected output: server error
  test('PUT player FCM Token server error', async () => {
    const playerId = "000000000000000000000001";
    const fcmToken = "fcmtoken";
    const mockedFindOne = jest.fn(() => {
      throw new Error('Mocked error');
    });
    jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    const response = await request(app).put(`/player/${playerId}/fcmToken/${fcmToken}`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Server error' });
  });

});
