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
// import request from 'supertest';
// import { app } from '../../app.js';
// import { lobbiesCollection, playersCollection } from '../../helpers/mongodb.js';

// jest.mock('mongodb');

// // ChatGPT usage: NO
// // Interface POST /player/:playerId/run
// describe('Testing POST Player Run', () => {
//   // ChatGPT usage: NO
//   // Input: player run with no old lands
//   // Expected status code: 200
//   // Expected behavior: player run updated in database
//   // Expected output: player run updated
//   test('POST player run without old land', async () => {
//     const playerId = "000000000000000000000000";
//     const playerRun = [
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333},
//         {"latitude":49.269875,"longitude":-123.25413333333333},
//         {"latitude":49.269863333333326,"longitude":-123.25484666666668},
//         {"latitude":49.27040333333333,"longitude":-123.25496},
//         {"latitude":49.270328333333325,"longitude":-123.25435166666666},
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333}
//     ]
//     const mockedPlayer = { "_id": playerId,
//       "lobbySet": ["000000000000000000000001"],
//       "playerEmail": "johndoe@gmail.com",
//       "playerDisplayName": "John Doe",
//       "playerPhotoUrl": "testurl.com",
//       "totalAreaRan": 0.0,
//       "totalDistanceRan": 0.0,
//       "fcmToken": "cnkVEmapRIqEnIBV_W__LF:APA91bHz9E-DQ3tijrdG2o8ObtGcqPe3Vv-WeKnH8KZ-a-5a1IE8ZbhHIlq2CYRqguNWFFOIWXoxeUl0w40PCZaAaN9wtQf8oD2ZZ-nO072ZG9L0NQ31TrAMpApTb_tyU9vzDSaxz5xW"
//     }
//     const mockedLobby = { "_id": "000000000000000000000001",
//         "lobbyName": "Mock Lobby",
//         "lobbyLeaderId": playerId,
//         "playerSet": {
//                 [playerId]: {
//                 "distanceCovered": 0.0,
//                 "totalArea": 0.0,
//                 "lands": [],
//                 }
//             }
//         }
        
//     // updateLobbyMaps
//     const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
//     const mockedFindOneLobby = jest.fn().mockReturnValue(mockedLobby);
//     jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
//     jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
    
//     // skipping updateLobbyMaps because lobbySet is empty
    
//     // updatePlayerStats
//     // jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
//     // skipping implementation saying player is null

//     // notifyLobby
//     // jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    

//     const response = await request(app).post(`/run/player/${playerId}`).send(playerRun);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toEqual("Run successfully recorded");
//   });
// // ChatGPT usage: NO
//   // Input: player run with no old lands
//   // Expected status code: 200
//   // Expected behavior: player run updated in database
//   // Expected output: player run updated
//   test('POST player run with old land', async () => {
//     const playerId = "000000000000000000000000";
//     const playerRun = [
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333},
//         {"latitude":49.269875,"longitude":-123.25413333333333},
//         {"latitude":49.269863333333326,"longitude":-123.25484666666668},
//         {"latitude":49.27040333333333,"longitude":-123.25496},
//         {"latitude":49.270328333333325,"longitude":-123.25435166666666},
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333}
//     ]
//     const mockedPlayer = { "_id": playerId,
//       "lobbySet": ["000000000000000000000001"],
//       "playerEmail": "johndoe@gmail.com",
//       "playerDisplayName": "John Doe",
//       "playerPhotoUrl": "testurl.com",
//       "totalAreaRan": 0.0,
//       "totalDistanceRan": 0.0,
//       "fcmToken": "cnkVEmapRIqEnIBV_W__LF:APA91bHz9E-DQ3tijrdG2o8ObtGcqPe3Vv-WeKnH8KZ-a-5a1IE8ZbhHIlq2CYRqguNWFFOIWXoxeUl0w40PCZaAaN9wtQf8oD2ZZ-nO072ZG9L0NQ31TrAMpApTb_tyU9vzDSaxz5xW"
//     }
//     const mockedLobby = { "_id": "000000000000000000000001",
//         "lobbyName": "Mock Lobby",
//         "lobbyLeaderId": playerId,
//         "playerSet": {
//                 [playerId]: {
//                 "distanceCovered": 0.0,
//                 "totalArea": 0.0,
//                 "lands": [[
//                     {
//                       "latitude": 49.26302166666666,
//                       "longitude": -123.25127166666668
//                     },
//                     {
//                       "latitude": 49.26313333333333,
//                       "longitude": -123.25187333333334
//                     },
//                     {
//                       "latitude": 49.26450499999999,
//                       "longitude": -123.25363333333334
//                     },
//                     {
//                       "latitude": 49.26428166666666,
//                       "longitude": -123.25444833333334
//                     },
//                     {
//                       "latitude": 49.264782786243835,
//                       "longitude": -123.25264007075158
//                     },
//                     {
//                       "latitude": 49.26501,
//                       "longitude": -123.25255999999999
//                     },
//                     {
//                       "latitude": 49.26514999999999,
//                       "longitude": -123.251315
//                     },
//                     {
//                       "latitude": 49.26495333333334,
//                       "longitude": -123.25032833333334
//                     },
//                     {
//                       "latitude": 49.26447833333334,
//                       "longitude": -123.24994166666666
//                     },
//                     {
//                       "latitude": 49.263805000000005,
//                       "longitude": -123.24925499999999
//                     },
//                     {
//                       "latitude": 49.263385,
//                       "longitude": -123.24998500000001
//                     },
//                     {
//                       "latitude": 49.26302166666666,
//                       "longitude": -123.25127166666668
//                     }
//                   ]],
//                 }
//             }
//         }
        
//     // updateLobbyMaps
//     const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
//     const mockedFindOneLobby = jest.fn().mockReturnValue(mockedLobby);
//     jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
//     jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
    
//     // skipping updateLobbyMaps because lobbySet is empty
    
//     // updatePlayerStats
//     // jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
//     // skipping implementation saying player is null

//     // notifyLobby
//     // jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
    

//     const response = await request(app).post(`/run/player/${playerId}`).send(playerRun);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toEqual("Run successfully recorded");
//   });
// // ChatGPT usage: NO
//   // Input: player run with no old lands
//   // Expected status code: 200
//   // Expected behavior: player run updated in database
//   // Expected output: player run updated
//   test('POST player run with old land and other players in lobby', async () => {
//     const playerId = "000000000000000000000000";
//     const playerRun = [
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333},
//         {"latitude":49.269875,"longitude":-123.25413333333333},
//         {"latitude":49.269863333333326,"longitude":-123.25484666666668},
//         {"latitude":49.27040333333333,"longitude":-123.25496},
//         {"latitude":49.270328333333325,"longitude":-123.25435166666666},
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333}
//     ]
//     const mockedPlayer = { "_id": playerId,
//       "lobbySet": ["000000000000000000000001"],
//       "playerEmail": "johndoe@gmail.com",
//       "playerDisplayName": "John Doe",
//       "playerPhotoUrl": "testurl.com",
//       "totalAreaRan": 0.0,
//       "totalDistanceRan": 0.0,
//       "fcmToken": "cnkVEmapRIqEnIBV_W__LF:APA91bHz9E-DQ3tijrdG2o8ObtGcqPe3Vv-WeKnH8KZ-a-5a1IE8ZbhHIlq2CYRqguNWFFOIWXoxeUl0w40PCZaAaN9wtQf8oD2ZZ-nO072ZG9L0NQ31TrAMpApTb_tyU9vzDSaxz5xW"
//     }
//     const mockedLobby = { "_id": "000000000000000000000001",
//         "lobbyName": "Mock Lobby",
//         "lobbyLeaderId": playerId,
//         "playerSet": {
//                 [playerId]: {
//                 "distanceCovered": 0.0,
//                 "totalArea": 0.0,
//                 "lands": [[
//                     {
//                       "latitude": 49.26302166666666,
//                       "longitude": -123.25127166666668
//                     },
//                     {
//                       "latitude": 49.26313333333333,
//                       "longitude": -123.25187333333334
//                     },
//                     {
//                       "latitude": 49.26450499999999,
//                       "longitude": -123.25363333333334
//                     },
//                     {
//                       "latitude": 49.26428166666666,
//                       "longitude": -123.25444833333334
//                     },
//                     {
//                       "latitude": 49.264782786243835,
//                       "longitude": -123.25264007075158
//                     },
//                     {
//                       "latitude": 49.26501,
//                       "longitude": -123.25255999999999
//                     },
//                     {
//                       "latitude": 49.26514999999999,
//                       "longitude": -123.251315
//                     },
//                     {
//                       "latitude": 49.26495333333334,
//                       "longitude": -123.25032833333334
//                     },
//                     {
//                       "latitude": 49.26447833333334,
//                       "longitude": -123.24994166666666
//                     },
//                     {
//                       "latitude": 49.263805000000005,
//                       "longitude": -123.24925499999999
//                     },
//                     {
//                       "latitude": 49.263385,
//                       "longitude": -123.24998500000001
//                     },
//                     {
//                       "latitude": 49.26302166666666,
//                       "longitude": -123.25127166666668
//                     }
//                   ]],
//                 },
//                 "000000000000000000000002": {
//                     "distanceCovered": 0.0,
//                     "totalArea": 0.0,
//                     "lands": [
//                       [
//                         {
//                           "latitude": 49.252945,
//                           "longitude": -123.24679499999999
//                         },
//                         {
//                           "latitude": 49.2541783579289,
//                           "longitude": -123.24815329548534
//                         },
//                         {
//                           "latitude": 49.253206666666664,
//                           "longitude": -123.24801333333335
//                         },
//                         {
//                           "latitude": 49.25417417541963,
//                           "longitude": -123.24918895973265
//                         },
//                         {
//                           "latitude": 49.25399666666667,
//                           "longitude": -123.25300999999999
//                         },
//                         {
//                           "latitude": 49.255300000000005,
//                           "longitude": -123.25348166666666
//                         },
//                         {
//                           "latitude": 49.254538526630554,
//                           "longitude": -123.24947836515126
//                         },
//                         {
//                           "latitude": 49.25500666666667,
//                           "longitude": -123.24872166666667
//                         },
//                         {
//                           "latitude": 49.25423891600129,
//                           "longitude": -123.24818977160825
//                         },
//                         {
//                           "latitude": 49.254445000000004,
//                           "longitude": -123.24552999999999
//                         },
//                         {
//                           "latitude": 49.252945,
//                           "longitude": -123.24679499999999
//                         }
//                       ]
//                     ],
//                     "color": -2290138
//                   }
//             }
//         }
        
//     const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
//     const mockedFindOneLobby = jest.fn().mockReturnValue(mockedLobby);
//     jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
//     jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
//     const response = await request(app).post(`/run/player/${playerId}`).send(playerRun);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toEqual("Run successfully recorded");
//   });
// // ChatGPT usage: NO
//   // Input: player run with no old lands
//   // Expected status code: 200
//   // Expected behavior: player run updated in database
//   // Expected output: player run updated
//   test('POST player run invalid id', async () => {
//     const playerId = "1";
//     const playerRun = [
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333},
//         {"latitude":49.269875,"longitude":-123.25413333333333},
//         {"latitude":49.269863333333326,"longitude":-123.25484666666668},
//         {"latitude":49.27040333333333,"longitude":-123.25496},
//         {"latitude":49.270328333333325,"longitude":-123.25435166666666},
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333}
//     ]
//     const response = await request(app).post(`/run/player/${playerId}`).send(playerRun);
//     expect(response.statusCode).toBe(400);
//     expect(response.body).toEqual({ error: 'Insufficient player run fields' });
//   });
// // ChatGPT usage: NO
//   // Input: player run with no old lands
//   // Expected status code: 200
//   // Expected behavior: player run updated in database
//   // Expected output: player run updated
//   test('POST player run server error', async () => {
//     const playerId = "000000000000000000000000";
//     const playerRun = [
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333},
//         {"latitude":49.269875,"longitude":-123.25413333333333},
//         {"latitude":49.269863333333326,"longitude":-123.25484666666668},
//         {"latitude":49.27040333333333,"longitude":-123.25496},
//         {"latitude":49.270328333333325,"longitude":-123.25435166666666},
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333}
//     ]
//     const mockedFindOne = jest.fn(() => {
//         throw new Error('Mocked error');
//     });
//     jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
//     const response = await request(app).post(`/run/player/${playerId}`).send(playerRun);
//     expect(response.statusCode).toBe(500);
//     expect(response.body).toEqual({ error: 'Server error' });
//   });

// // ChatGPT usage: NO
//   // Input: player run with no old lands
//   // Expected status code: 200
//   // Expected behavior: player run updated in database
//   // Expected output: player run updated
//   test('POST player run server error', async () => {
//     const playerId = "000000000000000000000000";
//     const playerRun = [
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333},
//         {"latitude":49.269875,"longitude":-123.25413333333333},
//         {"latitude":49.269863333333326,"longitude":-123.25484666666668},
//         {"latitude":49.27040333333333,"longitude":-123.25496},
//         {"latitude":49.270328333333325,"longitude":-123.25435166666666},
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333}
//     ]
//     const mockedFindOne = jest.fn(() => {
//         throw new Error('Mocked error');
//     });
//     jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
//     const response = await request(app).post(`/run/player/${playerId}`).send(playerRun);
//     expect(response.statusCode).toBe(500);
//     expect(response.body).toEqual({ error: 'Server error' });
//   });


// // ChatGPT usage: NO
//   // Input: player run with no old lands
//   // Expected status code: 200
//   // Expected behavior: player run updated in database
//   // Expected output: player run updated
//   test('POST player run with old update stats', async () => {
//     const playerId = "000000000000000000000000";
//     const playerRun = [
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333},
//         {"latitude":49.269875,"longitude":-123.25413333333333},
//         {"latitude":49.269863333333326,"longitude":-123.25484666666668},
//         {"latitude":49.27040333333333,"longitude":-123.25496},
//         {"latitude":49.270328333333325,"longitude":-123.25435166666666},
//         {"latitude":49.270316666666666,"longitude":-123.25431333333333}
//     ]
//     const mockedPlayer = { "_id": playerId,
//       "lobbySet": ["000000000000000000000001"],
//       "playerEmail": "johndoe@gmail.com",
//       "playerDisplayName": "John Doe",
//       "playerPhotoUrl": "testurl.com",
//       "totalAreaRan": 0.0,
//       "totalDistanceRan": 0.0,
//       "fcmToken": "cnkVEmapRIqEnIBV_W__LF:APA91bHz9E-DQ3tijrdG2o8ObtGcqPe3Vv-WeKnH8KZ-a-5a1IE8ZbhHIlq2CYRqguNWFFOIWXoxeUl0w40PCZaAaN9wtQf8oD2ZZ-nO072ZG9L0NQ31TrAMpApTb_tyU9vzDSaxz5xW"
//     }
//     const mockedLobby = { "_id": "000000000000000000000001",
//         "lobbyName": "Mock Lobby",
//         "lobbyLeaderId": playerId,
//         "playerSet": {
//                 [playerId]: {
//                 "distanceCovered": 0.0,
//                 "totalArea": 0.0,
//                 "lands": [[
//                     {
//                       "latitude": 49.26302166666666,
//                       "longitude": -123.25127166666668
//                     },
//                     {
//                       "latitude": 49.26313333333333,
//                       "longitude": -123.25187333333334
//                     },
//                     {
//                       "latitude": 49.26450499999999,
//                       "longitude": -123.25363333333334
//                     },
//                     {
//                       "latitude": 49.26428166666666,
//                       "longitude": -123.25444833333334
//                     },
//                     {
//                       "latitude": 49.264782786243835,
//                       "longitude": -123.25264007075158
//                     },
//                     {
//                       "latitude": 49.26501,
//                       "longitude": -123.25255999999999
//                     },
//                     {
//                       "latitude": 49.26514999999999,
//                       "longitude": -123.251315
//                     },
//                     {
//                       "latitude": 49.26495333333334,
//                       "longitude": -123.25032833333334
//                     },
//                     {
//                       "latitude": 49.26447833333334,
//                       "longitude": -123.24994166666666
//                     },
//                     {
//                       "latitude": 49.263805000000005,
//                       "longitude": -123.24925499999999
//                     },
//                     {
//                       "latitude": 49.263385,
//                       "longitude": -123.24998500000001
//                     },
//                     {
//                       "latitude": 49.26302166666666,
//                       "longitude": -123.25127166666668
//                     }
//                   ]],
//                 },
//                 "000000000000000000000002": {
//                     "distanceCovered": 0.0,
//                     "totalArea": 0.0,
//                     "lands": [
//                       [
//                         {
//                           "latitude": 49.252945,
//                           "longitude": -123.24679499999999
//                         },
//                         {
//                           "latitude": 49.2541783579289,
//                           "longitude": -123.24815329548534
//                         },
//                         {
//                           "latitude": 49.253206666666664,
//                           "longitude": -123.24801333333335
//                         },
//                         {
//                           "latitude": 49.25417417541963,
//                           "longitude": -123.24918895973265
//                         },
//                         {
//                           "latitude": 49.25399666666667,
//                           "longitude": -123.25300999999999
//                         },
//                         {
//                           "latitude": 49.255300000000005,
//                           "longitude": -123.25348166666666
//                         },
//                         {
//                           "latitude": 49.254538526630554,
//                           "longitude": -123.24947836515126
//                         },
//                         {
//                           "latitude": 49.25500666666667,
//                           "longitude": -123.24872166666667
//                         },
//                         {
//                           "latitude": 49.25423891600129,
//                           "longitude": -123.24818977160825
//                         },
//                         {
//                           "latitude": 49.254445000000004,
//                           "longitude": -123.24552999999999
//                         },
//                         {
//                           "latitude": 49.252945,
//                           "longitude": -123.24679499999999
//                         }
//                       ],
//                     ],
//                     "color": -2290138
//                   }
//             }
//         }
        
    
//     const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
//     const mockedFindOneLobby = jest.fn().mockReturnValue(mockedLobby);
//     const mockedUpdateOne = jest.fn().mockReturnValue({"modifiedCount": 1});
//     jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOne);
//     jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOne);
//     jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
//     jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
//     const response = await request(app).post(`/run/player/${playerId}`).send(playerRun);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toEqual("Run successfully recorded");
//   });
// // ChatGPT usage: NO
//   // Input: player run with no old lands
//   // Expected status code: 200
//   // Expected behavior: player run updated in database
//   // Expected output: player run updated
//   test('POST player run with cutting land in half', async () => {
//     const playerId = "000000000000000000000000";
//     const playerRun = [
//         {"latitude": 49.26685718585053, "longitude": -123.14341074410541},
//         {"latitude": 49.26755240175389, "longitude": -123.13393618434876},
//         {"latitude": 49.21036853985731, "longitude":  -123.1326720641492},
//         {"latitude": 49.2107773097122, "longitude": -123.14331350409009},
//         {"latitude": 49.26685718585053, "longitude": -123.14341074410541}
//     ]
//     const mockedPlayer = { "_id": playerId,
//       "lobbySet": ["000000000000000000000001"],
//       "playerEmail": "johndoe@gmail.com",
//       "playerDisplayName": "John Doe",
//       "playerPhotoUrl": "testurl.com",
//       "totalAreaRan": 0.0,
//       "totalDistanceRan": 0.0,
//       "fcmToken": "cnkVEmapRIqEnIBV_W__LF:APA91bHz9E-DQ3tijrdG2o8ObtGcqPe3Vv-WeKnH8KZ-a-5a1IE8ZbhHIlq2CYRqguNWFFOIWXoxeUl0w40PCZaAaN9wtQf8oD2ZZ-nO072ZG9L0NQ31TrAMpApTb_tyU9vzDSaxz5xW"
//     }
//     const mockedLobby = { "_id": "000000000000000000000001",
//         "lobbyName": "Mock Lobby",
//         "lobbyLeaderId": playerId,
//         "playerSet": {
//                 [playerId]: {
//                 "distanceCovered": 0.0,
//                 "totalArea": 0.0,
//                 "lands": [],
//                 },
//                 "000000000000000000000002": {
//                     "distanceCovered": 0.0,
//                     "totalArea": 0.0,
//                     "lands": [
//                       [
//                         {"latitude": 49.252707966045875, "longitude": -123.17803664522421},
//                         {"latitude": 49.24693453738671, "longitude": -123.1770431059369},
//                         {"latitude": 49.24469342620704, "longitude": -123.09027541745577},
//                         {"latitude": 49.25393321491215, "longitude": -123.09063478272991},
//                         {"latitude": 49.252707966045875, "longitude": -123.17803664522421}
//                       ],
//                     ],
//                     "color": -2290138
//                   }
//             }
//         }
        
    
//     const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
//     const mockedFindOneLobby = jest.fn().mockReturnValue(mockedLobby);
//     const mockedUpdateOne = jest.fn().mockReturnValue({"modifiedCount": 1});
//     jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOne);
//     jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOne);
//     jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
//     jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
//     const response = await request(app).post(`/run/player/${playerId}`).send(playerRun);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toEqual("Run successfully recorded");
//   });

// // ChatGPT usage: NO
//   // Input: player run with an invalid coordinate
//   // Expected status code: 500
//   // Expected behavior: player run updated in database
//   // Expected output: player run updated
//   // test('POST player run with an invalid coordinate', async () => {
//   //   const playerId = "000000000000000000000000";
//   //   const playerRun = [
//   //       {"latitude": 49.26685718585053, "longitude": -123.14341074410541},
//   //       {"latitude": 49.26755240175389, "longitude": -123.13393618434876},
//   //       {"latitude": 49.21036853985731, "longitude":  -123.1326720641492},
//   //       {"BAD COORDINATE": 49.21036853985731, "longitude":  -123.1326720641492},
//   //       {"latitude": 49.2107773097122, "longitude": -123.14331350409009},
//   //       {"latitude": 49.26685718585053, "longitude": -123.14341074410541}
//   //   ]
//   //   const mockedPlayer = { "_id": playerId,
//   //     "lobbySet": ["000000000000000000000001"],
//   //     "playerEmail": "johndoe@gmail.com",
//   //     "playerDisplayName": "John Doe",
//   //     "playerPhotoUrl": "testurl.com",
//   //     "totalAreaRan": 0.0,
//   //     "totalDistanceRan": 0.0,
//   //     "fcmToken": "cnkVEmapRIqEnIBV_W__LF:APA91bHz9E-DQ3tijrdG2o8ObtGcqPe3Vv-WeKnH8KZ-a-5a1IE8ZbhHIlq2CYRqguNWFFOIWXoxeUl0w40PCZaAaN9wtQf8oD2ZZ-nO072ZG9L0NQ31TrAMpApTb_tyU9vzDSaxz5xW"
//   //   }
//   //   const mockedLobby = { "_id": "000000000000000000000001",
//   //       "lobbyName": "Mock Lobby",
//   //       "lobbyLeaderId": playerId,
//   //       "playerSet": {
//   //               [playerId]: {
//   //               "distanceCovered": 0.0,
//   //               "totalArea": 0.0,
//   //               "lands": [],
//   //               },
//   //               "000000000000000000000002": {
//   //                   "distanceCovered": 0.0,
//   //                   "totalArea": 0.0,
//   //                   "lands": [
//   //                     [
//   //                       {"latitude": 49.252707966045875, "longitude": -123.17803664522421},
//   //                       {"latitude": 49.24693453738671, "longitude": -123.1770431059369},
//   //                       {"latitude": 49.24469342620704, "longitude": -123.09027541745577},
//   //                       {"latitude": 49.25393321491215, "longitude": -123.09063478272991},
//   //                       {"latitude": 49.252707966045875, "longitude": -123.17803664522421}
//   //                     ],
//   //                   ],
//   //                   "color": -2290138
//   //                 }
//   //           }
//   //       }
        
    
//   //   const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
//   //   const mockedFindOneLobby = jest.fn().mockReturnValue(mockedLobby);
//   //   const mockedUpdateOne = jest.fn().mockReturnValue({"modifiedCount": 1});
//   //   jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOne);
//   //   jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOne);
//   //   jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
//   //   jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
//   //   const response = await request(app).post(`/run/player/${playerId}`).send(playerRun);
//   //   expect(response.statusCode).toBe(500);
//   //   expect(response.body).toEqual({ error: "Server error" });
//   // });

// // ChatGPT usage: NO
//   // Input: player run with no old lands
//   // Expected status code: 200
//   // Expected behavior: player run updated in database
//   // Expected output: player run updated
//   test('POST player run union with self old land', async () => {
//     const playerId = "000000000000000000000000";
//     const playerRun = [
//         {"latitude": 49.255312963264245, "longitude": -123.1460911862678},
//         {"latitude": 49.255478530474804, "longitude": -123.14148708293223},
//         {"latitude": 49.25288458037093, "longitude": -123.14184644820638},
//         {"latitude": 49.255312963264245, "longitude": -123.1460911862678}
//     ]
//     const mockedPlayer = { "_id": playerId,
//       "lobbySet": ["000000000000000000000001"],
//       "playerEmail": "johndoe@gmail.com",
//       "playerDisplayName": "John Doe",
//       "playerPhotoUrl": "testurl.com",
//       "totalAreaRan": 0.0,
//       "totalDistanceRan": 0.0,
//       "fcmToken": "cnkVEmapRIqEnIBV_W__LF:APA91bHz9E-DQ3tijrdG2o8ObtGcqPe3Vv-WeKnH8KZ-a-5a1IE8ZbhHIlq2CYRqguNWFFOIWXoxeUl0w40PCZaAaN9wtQf8oD2ZZ-nO072ZG9L0NQ31TrAMpApTb_tyU9vzDSaxz5xW"
//     }
//     const mockedLobby = { "_id": "000000000000000000000001",
//         "lobbyName": "Mock Lobby",
//         "lobbyLeaderId": playerId,
//         "playerSet": {
//                 [playerId]: {
//                 "distanceCovered": 0.0,
//                 "totalArea": 0.0,
//                 "lands": [[
//                     {"latitude": 49.2572114339522, "longitude": -123.13897152601332},
//                     {"latitude": 49.2493190563024, "longitude": -123.13960147219974},
//                     {"latitude": 49.257023797659386, "longitude": -123.15276692471303},
//                     {"latitude": 49.2572114339522, "longitude": -123.13897152601332}
//                 ]],
//                 }
//             }
//         }
        
    
//     const mockedFindOne = jest.fn().mockReturnValue(mockedPlayer);
//     const mockedFindOneLobby = jest.fn().mockReturnValue(mockedLobby);
//     const mockedUpdateOne = jest.fn().mockReturnValue({"modifiedCount": 1});
//     jest.spyOn(playersCollection, 'updateOne').mockImplementation(mockedUpdateOne);
//     jest.spyOn(lobbiesCollection, 'updateOne').mockImplementation(mockedUpdateOne);
//     jest.spyOn(playersCollection, 'findOne').mockImplementation(mockedFindOne);
//     jest.spyOn(lobbiesCollection, 'findOne').mockImplementation(mockedFindOneLobby);
//     const response = await request(app).post(`/run/player/${playerId}`).send(playerRun);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toEqual("Run successfully recorded");
//   });

// });