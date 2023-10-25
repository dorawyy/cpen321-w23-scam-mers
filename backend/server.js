var express = require("express")
var app = express()
const https = require('https')
const fs = require('fs')

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: 'password'
};

const {MongoClient} = require("mongodb")
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

app.get("/", (req,res)=>{
    res.send("Welcome to RunIO")
})

app.post('/adduser', async (req, res) => {
  try {
    const player = req.body;

    if (!player) {
      return res.status(400).json({ error: 'Player object is required' });
    }

    const usersCollection = client.db("runio").collection("users");

    const result = await usersCollection.insertOne(player);

    if (result.insertedCount === 1) {
      return res.status(201).json(player);
    } else {
      return res.status(500).json({ error: 'User could not be added' });
    }
  } catch (error) {
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
