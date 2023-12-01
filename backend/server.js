import * as https from "https";
import * as fs from "fs";
import { client } from './helpers/mongodb.js'
import { app } from "./app.js";

// ChatGPT usage: YES
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: 'password'
};

// ChatGPT usage: NO
async function run(port){
  try{
    await client.connect();
    console.log('Successfully Connected to MongoDB');
    // var app = express();

    // app.use('/lobby', lobbyRoutes);
    // app.use('/run', runRoutes);
    // app.use('/player', playerRoutes);
    // app.use('/', landingRoutes);
    

    const server = https.createServer(options, app); // Use HTTPS server here
    server.listen(port, () => { // Listen on the default HTTPS port (443)
      var host = server.address().address;
      var port = server.address().port;
      console.log("RunIO Server Running on: https://%s:%s", host, port);
    });
  }
  catch(err){
    console.log(err);
    await client.close();
  }
}

run(8081);