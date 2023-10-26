var express = require("express")
var app = express()
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: 'password'
};

const {MongoClient} = require("mongodb");
const { emit } = require("process");
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

// app.use(express.json()); // Add this line to enable JSON body parsing
app.use(bodyParser.json());

app.get("/", (req,res)=>{
    res.send("Welcome to RunIO")
})

app.put('/user/:playerEmail', async (req, res) => {
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
      const result = await usersCollection.update({ _id: existingUser.id }, { $set: playerData });
      return res.status(200).json({message: "Updated existing user"});
    } else {
      const result = await usersCollection.insertOne(playerData)
      return res.status(201).json({message: "Created new user"});
    }
  } catch (error) {
    console.log("server error:" + error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/user/:playerEmail', async (req, res) => {
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
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
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
