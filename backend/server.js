import express from "express";
import * as https from "https";
import * as fs from "fs";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import { computeArea, computeLength } from "spherical-geometry-js";
import * as turf from "@turf/turf"

import admin from "firebase-admin";
import serviceAccount from './runio-401718-firebase-adminsdk-ezjsi-797731a4a0.js';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ChatGPT usage: YES
function sendNotification(token, title, body){
  const message = {
      data: {
          title: title,
          body: body,
      },
      token: token,
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

// ChatGPT usage: NO
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

// ChatGPT usage: YES
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: 'password'
};

app.use(bodyParser.json()); // Add this line to enable JSON body parsing

// ChatGPT usage: PARTIAL
app.get("/", (req,res)=>{
    res.send("Welcome to RunIO")
})

// ChatGPT usage: PARTIAL
app.put('/player/:playerEmail', async (req, res) => {
  console.log("playerEmail")
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

// ChatGPT usage: NO
app.put('/player/:playerId/fcmToken/:fcmToken', async (req, res) => {
  console.log("FCM TOKEN")
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

// ChatGPT usage: NO
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

// ChatGPT usage: NO
app.post('/lobby', async (req, res) => {
  try {
    const lobbyData = req.body;

    if (!lobbyData) {
      return res.status(400).json({ error: 'Insufficient lobby data' });
    }

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

// ChatGPT usage: NO
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

// ChatGPT usage: NO
app.get('/lobby/:lobbyId/lobbyName', async (req, res) => {
  try {
    const { lobbyId } = req.params;

    if (!lobbyId) {
      return res.status(400).json({ error: 'Lobby Id is required' });
    }

    const lobbiesCollection = client.db("runio").collection("lobbies");
    const existingLobby = await lobbiesCollection.findOne(
      { _id: new ObjectId(lobbyId) }, { projection: { lobbyName: true, _id: false } }
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

// ChatGPT usage: NO
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

    playerStats["color"] = lobby.availableColors.pop(); // check if lobby full or not
    lobby.playerSet[playerId] = playerStats;

    const lobbyResult = await lobbiesCollection.updateOne({ _id: new ObjectId(lobbyId) },{ $set:{playerSet: lobby.playerSet,availableColors:lobby.availableColors}});
    const playerResult = await playersCollection.updateOne({ _id: new ObjectId(playerId) }, { $push: { lobbySet: lobbyId} });

    return res.status(200).json({message: "Player added"});
  } catch (error) {
    console.log("server error:" + error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ChatGPT usage: NO
async function notifyLobby(playerId) {
  const runner = await playersCollection.findOne({ _id: new ObjectId(playerId) });
  const lobbySet = runner["lobbySet"]
  const playerIds = {}
  for (const lobby in lobbySet){
    const playerSet = lobby.playerSet;
    for (const player in playerSet){
      curr_playerId = Object.keys(player(0))
      if(playerIds[curr_playerId] == undefined && curr_playerId != playerId){
        curr_player = await playersCollection.findOne({ _id: new ObjectId(curr_playerId) });
        playerIds[curr_playerId] = curr_player["fcmToken"]
      } 
    }
  }
  try{
    sendNotification(runner.fcmToken, "CONGRATULATIONS!!", "You just completed a run! Keep it up! 🏆");  
  } catch{
  }
  for (const playerId in playerIds) {
    try {
      player_fcmToken = playerIds[playerId]
      sendNotification(player_fcmToken, runner.playerDisplayName + " just completed a run!", "Keep running to catch up. 🏃🔥");
    } catch {
    }
  }
}

// ChatGPT usage: NO
app.post('/player/:playerId/run', async (req, res) => {
  try {
    const { playerId } = req.params;
    const playerRun = req.body;

    if (!playerId || !playerRun) {
      return res.status(400).json({ error: 'Insufficient player run fields' });
    }

    // console.log("playerRun: " + JSON.stringify(playerRun));

    // Analyze run and update statistics, maps, etc.
    const pathArea = computeArea(playerRun) / 1000000; // Update this in every lobby player is in. Lobbyarea += area
    const pathDist = computeLength(playerRun) / 1000; // Update this in every lobby player is in. LobbyDist += dist

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

    await updateLobbyMaps(playerId, playerRun);

    // Update personal stats and lobby stats(distance and total area)
    await updatePlayerStats(playerId, pathArea, pathDist);

    // let updatedRun = req.body;
    // updatedRun["area"] = pathArea;
    // updatedRun["dist"] = pathDist;

    // return res.status(200).json({ message: res.body });
    await notifyLobby(playerId);
    return res.status(200).json({ message: "Run seccessfully recorded" });
  } catch (error) {
    console.log("server error:" + error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ChatGPT usage: NO
function pathToPolygon(path) {
  // console.log("IN pathToPolygon\n");
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

  // console.log(`INPUT PATH: ${JSON.stringify(path)}\n`);
  // console.log(`POINT LIST: ${pointList}\n`);

  let pathPolygon = turf.polygon(pointList);
  // console.log("PATH POLYGON" + JSON.stringify(pathPolygon) + "\n");
  return pathPolygon;
}

// ChatGPT usage: NO
async function updateLobbyMaps(playerId, addedLand) {
  const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });
  // console.log(`INPUT LAND: ${addedLand}`);
  if (player) {
    const playerLobbies = player["lobbySet"];
    // console.log("Player lobbies:" + JSON.stringify(playerLobbies) +"\n");
    for (let i in playerLobbies) {
      // console.log("LOBBY ID: " + playerLobbies[lobbyId]);
      let newLand;

      let lobbyId = new ObjectId(playerLobbies[i]);
      let lobby = await lobbiesCollection.findOne({ _id: lobbyId });
      // console.log("Lobby: " + JSON.stringify(lobby) + "\n");
      // console.log("LOBBY: " + JSON.stringify(lobby["playerSet"]));
      // let oldLand = lobby["playerSet"][playerId]["lands"];
      let oldLand = lobby.playerSet[playerId]["lands"];
      // console.log("OLD LAND: " + JSON.stringify(oldLand)+ "\n");

      newLand = unionLand(oldLand, addedLand, player, lobby);
      // console.log("NEW LAND: " + JSON.stringify(newLand)+ "\n");

      subtractLand(addedLand, lobby, playerId);
    }
  } else {
    console.log("Player not found.");
    return null; // throw/ catch exception??
  }
}

// ChatGPT usage: NO
function unionLand(oldLand, newLand, player, lobby) {
  if (!oldLand || oldLand.length === 0) {
    let updatedLandSet = [];
    updatedLandSet.push(polygonToLand(pathToPolygon(newLand)));
    updateMapInLobby(player._id, updatedLandSet, lobby._id);
    return updatedLandSet;
  }

  let updatedLandSet = [];
  let union = pathToPolygon(newLand);
  for (let i in oldLand) {
    let oldPoly = pathToPolygon(oldLand[i]);

    let temp = turf.union(oldPoly, union);
    // If the union is one polygon update union
    if (temp.geometry["type"] == "Polygon") {
      union = temp;
    } else if (turf.difference(oldPoly, union) == null) {
      // do nothing;
    } else if (turf.difference(union, oldPoly) == null) {
      union = oldPoly;
    } else {
      updatedLandSet.push(oldLand[i]);
    }
  }
  // Finally push the union
  updatedLandSet.push(polygonToLand(union));
  
  console.log("UPDATED LAND SET: " + JSON.stringify(updatedLandSet));
  updateMapInLobby(player._id, updatedLandSet, lobby._id);

  return updatedLandSet;
}

// ChatGPT usage: NO
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

// ChatGPT usage: NO
function polygonToLand2(poly) {

  let land = [];
  // console.log("POLY TO LAND FUNCTION 2: "+ JSON.stringify(poly));
  // console.log("POLY TO LAND FUNCTION 2: "+ JSON.stringify(poly[0]));

  for (let i in poly[0]) {
    let coordObj = {
      "latitude": poly[0][i][0],
      "longitude": poly[0][i][1],
    }
    // console.log(`COORD OBJ: ${JSON.stringify(coordObj)}`);
    land.push(coordObj);
  }
  return land;
}

// ChatGPT usage: NO
function subtractLand(addedLand, lobby, playerId) {
  console.log("IN SUBTRACT LAND\n");
  // console.log(JSON.stringify(lobby) + "player: "+ playerId);

  // console.log(`NOW IN ${lobby.lobbyName}`);
  for (let [oppId, oppData] of Object.entries(lobby["playerSet"])) {
    // console.log(`oppId: ${oppId}, playerId: ${playerId}`);
    if (oppId != playerId) {
      let oppLandSet = oppData["lands"];
      // console.log(`oppId: ${oppId}, playerId: ${playerId}\n`);
      console.log(`oppLandSet: ${JSON.stringify(oppLandSet)}\n`);

      let updatedLandSet = []; // THIS DOESNT GET UPDATED SO IDK IF PLAYER LAND IS GETTING UPDATED AFTER
      for (let i in oppLandSet) {
        let oppLand = oppLandSet[i];
        let oldPoly = pathToPolygon(oppLand);
        // console.log(`OLD POLY: ${JSON.stringify(oldPoly)}`);
        let newPoly = pathToPolygon(addedLand)
        // console.log(`NEW POLY: ${JSON.stringify(newPoly)}`);
        let updatedOppPoly = turf.difference(oldPoly, newPoly);
        // console.log(`DIFFERENCE: ${JSON.stringify(updatedOppPoly)}`);
        console.log("DIFFERENCE POLYGON: "+ JSON.stringify(updatedOppPoly));

        // if (typeof(updatedOppPoly) == "MultiPolygon") {
        if(updatedOppPoly){
          if (updatedOppPoly.geometry["type"] == "MultiPolygon") {
            // If difference results in multiple polygons, difference returns a MultiPolygon
            // for (i in updatedOppPoly) {
            //   updatedLandSet.push(polygonToLand(updatedOppPoly[i])); // use polygonToLand2 function here
            // }
            for (i in updatedOppPoly.geometry.coordinates) {
              updatedLandSet.push(polygonToLand2(updatedOppPoly.geometry.coordinates[i])); // use polygonToLand2 function here
            }
          } else {
            updatedLandSet.push(polygonToLand(updatedOppPoly));
          }
        }
      }
      updateMapInLobby(oppId, updatedLandSet, lobby._id);

    }
  };
}

// ChatGPT usage: NO
async function updatePlayerStats(playerId, pathArea, pathDist){
  const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });
  if (player){
    player.totalAreaRan += pathArea;
    player.totalDistanceRan += pathDist;

    const result = await playersCollection.updateOne({ _id: player._id },{ $set: {totalAreaRan: player.totalAreaRan,totalDistanceRan: player.totalDistanceRan}});

    if (result.modifiedCount === 1) {
      console.log("Player stats updated");
      // return { totalAreaRan: player.totalAreaRan, totalDistanceRan: player.totalDistanceRan };
      const playerLobbies = player["lobbySet"];
      for (let i in playerLobbies) {
        // let lobbyId = new ObjectId(playerLobbies[i]);
        updatePlayerLobbyStats(playerLobbies[i], playerId, pathArea, pathDist);
      }
    } else {
        console.log("Player stats not updated");
        // return null; // throw/ catch exception??
    }
  }
  else {
    console.log("Player not found.");
    // return null; // throw/ catch exception??
  }
}

// ChatGPT usage: NO
async function updatePlayerLobbyStats(lobbyId, playerId, pathArea, pathDist) {
  const lobby = await lobbiesCollection.findOne({ _id: new ObjectId(lobbyId) });

  if (lobby) {
    const player = lobby.playerSet[playerId];

    if (player) {
      // Update the player's distance and area
      player.distanceCovered += pathDist;
      player.totalArea += pathArea;

      // Update the playerSet in the lobby
      lobby.playerSet[playerId] = player;

      const updateLobbyResult = await lobbiesCollection.updateOne({ _id: lobby._id },{$set: {playerSet: lobby.playerSet}});

      if (updateLobbyResult.modifiedCount === 1) {
        console.log(`Player stats updated in lobby: ${lobbyId}`);
      } else {
        console.log(`Failed to update player stats in lobby: ${lobbyId}`);
      }
    } else {
      console.log(`Player with ID ${playerId} not found in lobby: ${lobbyId}`);
    }
  } else {
    console.log(`Lobby with ID ${lobbyId} not found.`);
  }
}


// Helper function for updating a player's map in a specified lobby.
// playerId: Id of player who's map will be updated.
// newMap: The map which will replace the existing one. Stored as an array of shapes made up of coordinates.
// lobbyId: Id of lobby where map will be updated
// ChatGPT usage: NO
async function updateMapInLobby(playerId, newMap, lobbyId) {
  console.log("IN UPDATE MAP IN LOBBY\n");
  console.log("neqMAP:" + JSON.stringify(newMap) + "\n");
  console.log("playerId:" + playerId + "\n");
  console.log("lobbyId:" + lobbyId + "\n");
  const lobbiesCollection = client.db("runio").collection("lobbies");
  let query = "playerSet." + playerId;
  let setTarget = "playerSet." + playerId + ".lands"
  await lobbiesCollection.updateOne(
    { _id: new ObjectId(lobbyId),  [query]: {$exists: true} },{ $set: { [setTarget]: newMap }}
  );
}

// ChatGPT usage: NO
app.post('/tokensignin', async (req, res) => {
  const tokenId = req.body;
  console.log(tokenId);
});

// ChatGPT usage: NO
async function run(){
    try{
        await client.connect()
        console.log('Successfully Connected to MongoDB')
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
