import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

const playersCollection = client.db("runio").collection("players");
const lobbiesCollection = client.db("runio").collection("lobbies");

// ChatGPT Usage: YES
function isValidObjectId(str) {
    // ObjectID pattern
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  
    // Check if the string matches the pattern
    return objectIdPattern.test(str);
}

export { client, playersCollection, lobbiesCollection, isValidObjectId };