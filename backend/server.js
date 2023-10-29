import express from "express";
import * as https from "https";
import * as fs from "fs";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import { computeArea, computeLength } from "spherical-geometry-js";

var app = express();

const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

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

    const playersCollection = client.db("runio").collection("players");
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

app.get('/player/:player', async (req, res) => {
  try {
    const { player } = req.params;

    if (!player) {
      return res.status(400).json({ error: 'Player email or ID is required' });
    }

    const playersCollection = client.db("runio").collection("players");
    
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

    // Create a new lobby document
    const lobbiesCollection = client.db("runio").collection("lobbies");
    const lobbyResult = await lobbiesCollection.insertOne(lobbyData);

    // Update the creator's document to include the new lobby
    const playersCollection = client.db("runio").collection("players");
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
    const { lobbyId, playerId } = req.params;

    if (!lobbyId || !playerId) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const lobbiesCollection = client.db("runio").collection("lobbies");
    const playersCollection = client.db("runio").collection("players");

    // Check to make sure both the lobby and player exist before modifying the collections
    const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });
    const lobby = await lobbiesCollection.findOne({ _id: new ObjectId(lobbyId) });
    if (!player || !lobby) {
      return res.status(404).json({ error: 'Player or lobby not found' });
    } 
    
    // Check to make sure the player is not already part of the lobby
    if (lobby.playerSet.indexOf(playerId) != -1 || player.lobbySet.indexOf(lobbyId) != -1) {
      return res.status(200).json({message: "This player is already a member of this lobby"});
    }

    const lobbyResult = await lobbiesCollection.updateOne({ _id: new ObjectId(lobbyId) }, { $push: { playerSet: playerId} });
    const playerResult = await playersCollection.updateOne({ _id: new ObjectId(playerId) }, { $push: { lobbySet: lobbyId} });
    
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

    console.log(playerRun);
    // Analyze run and update statistics, maps, etc.
    
    const pathArea = computeArea(playerRun);
    const pathDist = computeLength(playerRun);

    // Go through lobbies of that player
    // For each lobby, union player's existing land, subtract from opponent's land
    // Recalculate area
    // Update personal stats (distance and total area)

    let updatedRun = req.body;
    updatedRun["area"] = pathArea;
    updatedRun["dist"] = pathDist;

    const obj = JSON.stringify(playerRun);
    console.log("OBJ: " + obj);

    console.log("Response body is: " + res.body);

    return res.status(200).json({ message: res.body });
  } catch (error) {
    console.log("server error:" + error);
    return res.status(500).json({ error: 'Server error' });
  }
});

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
