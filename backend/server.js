var express = require("express")
var app = express()
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser');
const {MongoClient, ObjectId} = require("mongodb");
const { emit } = require("process");

const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: 'password'
};

// app.use(express.json()); // Add this line to enable JSON body parsing
app.use(bodyParser.json());

app.get("/", (req,res)=>{
    res.send("Welcome to RunIO")
})

app.put('/player/:playerEmail', async (req, res) => {
  try {
    const { playerEmail } = req.params;
    const playerData = req.body;
    // console.log("email:" + playerEmail);
    // console.log("body:" + JSON.stringify(playerData));

    if (!playerEmail || !playerData) {
      return res.status(400).json({ error: 'Insufficient player data fields' });
    }

    const usersCollection = client.db("runio").collection("players");
    const existingUser = await usersCollection.findOne({ playerEmail: playerEmail });

    if (existingUser) {
      // console.log("Existing player found:" + existingUser._id)
      const result = await usersCollection.updateOne({ _id: new ObjectId(existingUser._id) }, { $set: playerData });
      return res.status(200).json({message: "Updated existing player"});
    } else {
      const result = await usersCollection.insertOne(playerData)
      return res.status(201).json({message: "Created new player", _id: result.insertedId});
    }
  } catch (error) {
    console.log("server error:" + error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/player/:playerEmail', async (req, res) => {
  try {
    const { playerEmail } = req.params;

    if (!playerEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const usersCollection = client.db("runio").collection("players");
    const existingUser = await usersCollection.findOne({ playerEmail: playerEmail });
    if (existingUser) {
      return res.status(200).json(existingUser);
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

    const lobbiesCollection = client.db("runio").collection("lobbies");
    const result = await lobbiesCollection.insertOne(lobbyData)
    return res.status(201).json({message: "Created new lobby", _id: result.insertedId});
    
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

app.put('/lobby/:lobbyId/player/:playerId', async (req, res) => {
  try {
    const { lobbyId, playerId } = req.params;

    if (!lobbyId || !playerId) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const usersCollection = client.db("runio").collection("players");
    const existingUser = await usersCollection.findOne({ playerEmail: playerEmail });

    if (existingUser) {
      const result = await usersCollection.update({ _id: existingUser.id }, { $set: playerData });
      return res.status(200).json({message: "Updated existing player"});
    } else {
      const result = await usersCollection.insertOne(playerData)
      return res.status(201).json({message: "Created new player", _id: result.insertedId});
    }
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
