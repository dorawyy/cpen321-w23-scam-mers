import * as https from "https";
import * as fs from "fs";
import { app, client } from './app.js'

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