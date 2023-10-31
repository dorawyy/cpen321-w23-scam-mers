import express from "express";
import * as https from "https";
import * as fs from "fs";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import { computeArea, computeLength } from "spherical-geometry-js";
import * as turf from "@turf/turf"
import request from "request";

// var express = require("express")
// const https = require('https')
// const fs = require('fs')
// const bodyParser = require('body-parser');
// const {MongoClient, ObjectId} = require("mongodb");
// const { emit } = require("process");
//const lobbyEndpoints = require('./lobbyEndpoints');

import admin from "firebase-admin";
import serviceAccount from './runio-401718-firebase-adminsdk-ezjsi-797731a4a0.js';
import path from "path";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function sendNotification(){
  const registrationToken = 'eNVBrb_dSDK50wdoS1oOZF:APA91bETz82TWyQmwiNHMpYfmvMPf8erwOQj-VLfuflpGiwViTJsdqWHyJZFJnscSLCOCsBNc5CBc366WxJdZO_nYDXUjVRw4w5VlwoEdBZtSYImdWsI3aJGR-69oPc4mDDFakxQFmYl';
  const message = {
      data: {
          title: 'Hiii',
          body: 'YESSSSS!!!',
      },
      token: registrationToken,
  };

  admin
      .messaging()
      .send(message)
      .then((response) => {
          console.log('Successfully sent message:', response);
      })
      .catch((error) => {
          console.error('Error sending message:', error);
      });
}

function createColor(R, G, B) {
  // Ensure that A, R, G, and B are within the 0-255 range

  // A = Math.min(255, Math.max(0, A));
  R = Math.min(255, Math.max(0, R));
  G = Math.min(255, Math.max(0, G));
  B = Math.min(255, Math.max(0, B));

  // Create the color in the specified format
  const color = (255 & 0xff) << 24 | (R & 0xff) << 16 | (G & 0xff) << 8 | (B & 0xff); // Always set Opacity to 255
  return color;
}

const availableColors = []
availableColors.push(createColor(0x7f,0x06,0x38)); //maroon
availableColors.push(createColor(0x5e,0x4f,0xa2)); //purple
availableColors.push(createColor(0x5c,0xb3,0x98)); //teal
availableColors.push(createColor(0x3f,0x3f,0x3f)); //gray
availableColors.push(createColor(0xf5,0xf2,0x47)); //yellow
availableColors.push(createColor(0xf2,0x63,0x13)); //orange
availableColors.push(createColor(0xe9,0x52,0xeb)); //pink
availableColors.push(createColor(0x78,0xfa,0x66)); //green
availableColors.push(createColor(0x32,0x88,0xbd)); //blue
availableColors.push(createColor(0xdd,0x0e,0x26)); //red

var app = express();

const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

const playersCollection = client.db("runio").collection("players");
const lobbiesCollection = client.db("runio").collection("lobbies");

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: 'password'
};

// app.use(express.json()); // Add this line to enable JSON body parsing
app.use(bodyParser.json());
//app.use(lobbyEndpoints(client));

app.get("/", (req,res)=>{
    res.send("Welcome to RunIO")
})

app.put('/player/:playerEmail', async (req, res) => {
  try {
    const { playerEmail } = req.params;
    const playerData = req.body;

    if (!playerEmail || !playerData) {
      return res.status(400).json({ error: 'Insufficient player data fields' });
    }

    const existingPlayer = await playersCollection.findOne({ playerEmail: playerEmail });

    if (existingPlayer) {
      const result = await playersCollection.updateOne({ _id: new ObjectId(existingPlayer._id) }, { $set: playerData });
      return res.status(200).json({message: "Updated existing player"});
    } else {
      const result = await playersCollection.insertOne(playerData)
      return res.status(201).json({message: "Created new player", _id: result.insertedId});
    }
  } catch (error) {
    console.log("server error:" + error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.put('/player/:playerId/fcmToken/:fcmToken', async (req, res) => {
  try {
    const { playerId, fcmToken } = req.params;

    if (!playerId || !fcmToken) {
      return res.status(400).json({ error: 'Insufficient player data fields' });
    }

    const existingPlayer = await playersCollection.findOne({ _id: new ObjectId(playerId) });

    if (existingPlayer) {
      const result = await playersCollection.updateOne({ _id: new ObjectId(existingPlayer._id) }, { $set: {"fcmToken" : fcmToken} });
      return res.status(200).json({message: "Updated player fcmToken"});
    } else {
      return res.status(404).json({ error: 'player not found' });
    }
  } catch (error) {
    console.log("server error:" + error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/player/:player', async (req, res) => {
  try {
    const { player } = req.params;

    if (!player) {
      return res.status(400).json({ error: 'Player email or ID is required' });
    }
    
    // Check if it is an email or _id
    let existingPlayer;
    if (player.indexOf('@') != -1) {
      existingPlayer = await playersCollection.findOne({ playerEmail: player });
    } else {
      existingPlayer = await playersCollection.findOne({ _id: new ObjectId(player) });
    }
    
    if (existingPlayer) {
      return res.status(200).json(existingPlayer);
    } else {
      console.log("player not found");
      return res.status(404).json({ error: 'player not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Server error' });
  }
});


app.post('/lobby', async (req, res) => {
  try {
    const lobbyData = req.body;

    if (!lobbyData) {
      return res.status(400).json({ error: 'Insufficient lobby data' });
    }

    // console.log("LobbyData: " + JSON.stringify(lobbyData));

    // const playerId = lobbyData["playerSet"][0];

    // const cloneAvailableColors = [...availableColors];
    // lobbyData["playerSet"] = [{
    //   "playerId": lobbyData.lobbyLeaderId, 
    //   "color": cloneAvailableColors.pop(),
    //   "distanceCovered": 0.0, 
    //   "totalArea": 0.0, 
    //   "lands": [], 
    // }];

    // console.log("LobbyData2: " + JSON.stringify(lobbyData));

    // Create a new lobby document
    const lobbiesCollection = client.db("runio").collection("lobbies");
    lobbyData.playerSet[lobbyData.lobbyLeaderId].color = availableColors[availableColors.length - 1];
    const lobbyResult = await lobbiesCollection.insertOne({availableColors: availableColors.slice(0, -1), ...lobbyData});

    // Update the creator's document to include the new lobby
    const playerResult = await playersCollection.updateOne({ _id: new ObjectId(lobbyData.lobbyLeaderId) }, { $push: { lobbySet: lobbyResult.insertedId.toString()} });

    return res.status(201).json({message: "Created new lobby", _id: lobbyResult.insertedId});

  } catch (error) {
    console.log("server error:" + error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/lobby/:lobbyId', async (req, res) => {
  try {
    const { lobbyId } = req.params;

    if (!lobbyId) {
      return res.status(400).json({ error: 'Lobby Id is required' });
    }
    const lobbiesCollection = client.db("runio").collection("lobbies");
    const existingLobby = await lobbiesCollection.findOne({ _id: new ObjectId(lobbyId) });
    if (existingLobby) {
      return res.status(200).json(existingLobby);
    } else {
      return res.status(404).json({ error: 'Lobby not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/lobby/:lobbyId/lobbyName', async (req, res) => {
  try {
    const { lobbyId } = req.params;

    if (!lobbyId) {
      return res.status(400).json({ error: 'Lobby Id is required' });
    }

    const lobbiesCollection = client.db("runio").collection("lobbies");
    const existingLobby = await lobbiesCollection.findOne(
      { _id: new ObjectId(lobbyId) },
      { projection: { lobbyName: true, _id: false } }
    );

    if (existingLobby) {
      return res.status(200).json(existingLobby);
    } else {
      return res.status(404).json({ error: 'Lobby not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.put('/lobby/:lobbyId/player/:playerId', async (req, res) => {
  try {
    //TODO: support the availableColor stack
    const { lobbyId, playerId } = req.params;
    const playerStats = req.body;

    if (!lobbyId || !playerId || !playerStats) {
      return res.status(400).json({ error: 'Missing parameters' });
    }


    // Check to make sure both the lobby and player exist before modifying the collections
    const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });
    const lobby = await lobbiesCollection.findOne({ _id: new ObjectId(lobbyId) });
    if (!player || !lobby) {
      return res.status(404).json({ error: 'Player or lobby not found' });
    }

    if (lobby.playerSet[playerId] != undefined || player.lobbySet[lobbyId] != undefined) {
      console.log("Player already in lobby");
      return res.status(200).json({message: "This player is already a member of this lobby"});
    }

    playerStats["color"] = lobby.availableColors.pop();
    lobby.playerSet[playerId] = playerStats;
    
    const lobbyResult = await lobbiesCollection.updateOne({ _id: new ObjectId(lobbyId) }, 
                              { $set: 
                                { 
                                  playerSet: lobby.playerSet, 
                                  availableColors:lobby.availableColors
                                } 
                              });
    const playerResult = await playersCollection.updateOne({ _id: new ObjectId(playerId) }, { $push: { lobbySet: lobbyId} });

    return res.status(200).json({message: "Player added"});
  } catch (error) {
    console.log("server error:" + error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/player/:playerId/run', async (req, res) => {
  try {
    const { playerId } = req.params;
    const playerRun = req.body;

    if (!playerId || !playerRun) {
      return res.status(400).json({ error: 'Insufficient player run fields' });
    }

    // console.log("playerRun: " + JSON.stringify(playerRun));

    // Analyze run and update statistics, maps, etc.
    const pathArea = computeArea(playerRun);
    const pathDist = computeLength(playerRun);

    // let lobbyId = new ObjectId("6540c12fd40fa749d5839e05");   // CHRIS LOBBY (Hard coded lobbyId to test updateMapInLobby)
    // let mapList = [playerRun]
    // updateMapInLobby(playerId, mapList, lobbyId)

    let testExistingLand = [[
      {"latitude": 49.26246, "longitude": -123.25537}, 
      {"latitude": 49.26257, "longitude": -123.25502}, 
      {"latitude": 49.26237, "longitude": -123.25485}, 
      {"latitude": 49.26226, "longitude": -123.25523}, 
      {"latitude": 49.26246, "longitude": -123.25537}, 
    ]]; 

    let testAddingLand = [
      {"latitude": 49.26239, "longitude": -123.25517}, 
      {"latitude": 49.2621, "longitude": -123.25497}, 
      {"latitude": 49.26197, "longitude": -123.25534}, 
      {"latitude": 49.26224, "longitude": -123.25558}, 
      {"latitude": 49.26239, "longitude": -123.25517}, 
    ];

    // let lobby = await lobbiesCollection.findOne({ _id: new ObjectId("6540c12fd40fa749d5839e05") });



    // const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });

    // TEST FOR updateLobbyMaps
    // updateLobbyMaps(playerId, testAddingLand);

    updateLobbyMaps(playerId, playerRun);

    // Update personal stats (distance and total area)
    const updatedPlayerStats = await updatePlayerStats(playerId, pathArea, pathDist);
    

    let updatedRun = req.body;
    updatedRun["area"] = pathArea;
    updatedRun["dist"] = pathDist;

    // console.log("Response body is: " + res.body);

    if (updatedPlayerStats){
      const responseMessage = {
        "areaRan": pathArea,
        "distRan": pathDist,
        "totalAreaRan": updatedPlayerStats["totalAreaRan"],
        "totalDistanceRan": updatedPlayerStats["totalDistanceRan"]
      }
      // return res.status(200).json(responseMessage);
    }
    

    return res.status(200).json({ message: res.body });
  } catch (error) {
    console.log("server error:" + error);
    return res.status(500).json({ error: 'Server error' });
  }
});

function pathToPolygon(path) {
  let pointList = [];
  // console.log(`PATH TO POLY INPUT PATH: ${JSON.stringify(path)}`)
  for (let point in path) {
    // console.log(JSON.stringify(path[point]));
    if (path[point]["latitude"] && path[point]["longitude"]) {
      let lat = path[point]["latitude"];
      let long = path[point]["longitude"];
      pointList.push([lat, long]);
    }
  }
  pointList = [pointList];

  // console.log(`INPUT PATH: ${JSON.stringify(path)}`);
  // console.log(`POINT LIST: ${pointList}`);

  let pathPolygon = turf.polygon(pointList);
  // console.log("PATH POLYGON" + JSON.stringify(pathPolygon));
  return pathPolygon;
}

// TODO: Test updateLobbyMaps
async function updateLobbyMaps(playerId, addedLand) {
  const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });
  // console.log(`INPUT LAND: ${addedLand}`);
  if (player) {
    const playerLobbies = player["lobbySet"];

    for (let i in playerLobbies) {
      // console.log("LOBBY ID: " + playerLobbies[lobbyId]);
      let newLand;

      let lobbyId = new ObjectId(playerLobbies[i]);
      let lobby = await lobbiesCollection.findOne({ _id: lobbyId });

      // console.log("LOBBY: " + JSON.stringify(lobby["playerSet"]));
      let oldLand = lobby["playerSet"][playerId]["lands"];
      // console.log("OLD LAND: " + JSON.stringify(oldLand));

      unionLand(oldLand, addedLand, player);
      // console.log("NEW LAND: " + JSON.stringify(newLand));

      subtractLand(addedLand, lobby, playerId);
    }
  } else {
    console.log("Player not found.");
    return null; // throw/ catch exception??
  }
}

function unionLand(oldLand, newLand, player) {
  // console.log("OLD: " + JSON.stringify(oldLand));
  // console.log("NEW: " + JSON.stringify(newLand));
  if (!oldLand) {
    return pathToPolygon(newLand);
  }
  
  let updatedLandSet = [];
  for (let i in oldLand) {
    // console.log(`OLD LAND ${i}: ${JSON.stringify(oldLand[i])}`);
    let oldPoly = pathToPolygon(oldLand[i]);
    let newPoly = pathToPolygon(newLand);

    // console.log(`OLD POLY: ${JSON.stringify(oldPoly)}`);
    // console.log(`NEW POLY: ${JSON.stringify(newPoly)}`);

    let union = turf.union(oldPoly, newPoly);
    // console.log("UNION: " + JSON.stringify(union));

    if (typeof(union) == "MultiPolygon") {
      // If two polygons are not intersecting, union returns a MultiPolygon
      for (i in union) {
        updatedLandSet.push(polygonToLand(union[i]));
      }
    } else {
      updatedLandSet.push(polygonToLand(union));
    }
  }

  let playerLobbies = player.lobbySet;
  
  for (let lobby in playerLobbies) {
    updateMapInLobby(player._id, updatedLandSet, playerLobbies[lobby]);
  }

  return updatedLandSet;
}

function polygonToLand(poly) {
  let land = [];
  for (let i in poly.geometry.coordinates[0]) {
    let coordObj = {
      "latitude": poly.geometry.coordinates[0][i][0],
      "longitude": poly.geometry.coordinates[0][i][1],
    }
    // console.log(`COORD OBJ: ${JSON.stringify(coordObj)}`);
    land.push(coordObj);
  }
  return land;
}

function subtractLand(addedLand, lobby, playerId) {
  // console.log(`NOW IN ${lobby.lobbyName}`);
  for (let [oppId, oppData] of Object.entries(lobby["playerSet"])) {
    // console.log(`oppId: ${oppId}, playerId: ${playerId}`);
    if (oppId != playerId) {
      let oppLandSet = oppData["lands"];

      // console.log(`oppLandSet: ${JSON.stringify(oppLandSet)}`);

      let updatedLandSet = [];
      for (let i in oppLandSet) {
        let oppLand = oppLandSet[i];
        let oldPoly = pathToPolygon(oppLand);
        // console.log(`OLD POLY: ${JSON.stringify(oldPoly)}`);
        let newPoly = pathToPolygon(addedLand)
        // console.log(`NEW POLY: ${JSON.stringify(newPoly)}`);
        let updatedOppPoly = turf.difference(oldPoly, newPoly);
        // console.log(`DIFFERENCE: ${JSON.stringify(updatedOppPoly)}`);

        if (typeof(updatedOppPoly) == "MultiPolygon") {
          // If difference results in multiple polygons, difference returns a MultiPolygon
          for (i in updatedOppPoly) {
            updatedLandSet.push(polygonToLand(updatedOppPoly[i]));
          }
          
        } else {
          updatedLandSet.push(polygonToLand(updatedOppPoly));
        }
      }
      updateMapInLobby(oppId, updatedLandSet, lobby._id);
    }
  };
}

async function updatePlayerStats(playerId, pathArea, pathDist){
  const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });
  if (player){
    player.totalAreaRan += pathArea;
    player.totalDistanceRan += pathDist;
    const result = await playersCollection.updateOne(
      { _id: player._id }, { $set: { totalAreaRan: player.totalAreaRan, totalDistanceRan: player.totalDistanceRan } });
    if (result.modifiedCount === 1) {
      console.log("Player stats updated");
      return { totalAreaRan: player.totalAreaRan, totalDistanceRan: player.totalDistanceRan };
    } else {
        console.log("Player stats not updated");
        return null; // throw/ catch exception??
    }
  } 
  else {
    console.log("Player not found.");
    return null; // throw/ catch exception??
  }
}

// Helper function for updating a player's map in a specified lobby.
// playerId: Id of player who's map will be updated.
// newMap: The map which will replace the existing one. Stored as an array of shapes made up of coordinates.
// lobbyId: Id of lobby where map will be updated
async function updateMapInLobby(playerId, newMap, lobbyId) {
  const lobbiesCollection = client.db("runio").collection("lobbies");
  let query = "playerSet." + playerId;
  let setTarget = "playerSet." + playerId + ".lands"
  await lobbiesCollection.updateOne(
    { _id: new ObjectId(lobbyId),  [query]: {$exists: true} },
    { $set: { [setTarget]: newMap }}, 
  );
}

app.post('/tokensignin', async (req, res) => {
  const tokenId = req.body;
  console.log(tokenId);
});

async function run(){
    try{
        await client.connect()
        console.log('Successfully Connected to MongoDB')
        // var server = app.listen(8081, (req, res) => {
        //     var host = server.address().address
        //     var port = server.address().port
        //     console.log("RunIO Server Running on: http://%s:%s", host, port)
        // })
        const server = https.createServer(options, app); // Use HTTPS server here
        server.listen(8081, () => { // Listen on the default HTTPS port (443)
            var host = server.address().address
            var port = server.address().port
            console.log("RunIO Server Running on: https://%s:%s", host, port)
        });
    }
    catch(err){
        console.log(err)
        await client.close()
    }
}

run()
// sendNotification()
