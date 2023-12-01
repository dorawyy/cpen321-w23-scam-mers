import express from "express";
import { ObjectId } from "mongodb";
import { lobbiesCollection, playersCollection, isValidObjectId} from "../helpers/mongodb.js";
import availableColors from "../helpers/colors.js";
import bodyParser from "body-parser";

var router = express.Router();
router.use(bodyParser.json()); // Add this line to enable JSON body parsing

// ChatGPT usage: NO
router.post('/', async (req, res) => {
    try {
      const lobbyData = req.body;
      const requiredFields = ['lobbyName', 'lobbyLeaderId', 'playerSet'];
  
      if (!requiredFields.every(field => field in lobbyData) || !lobbyData.playerSet[lobbyData.lobbyLeaderId]) {
        return res.status(400).json({ error: 'Insufficient lobby data' });
      }
      // Create a new lobby document
      lobbyData.playerSet[lobbyData.lobbyLeaderId].color = availableColors[availableColors.length - 1];
      const lobbyResult = await lobbiesCollection.insertOne({availableColors: availableColors.slice(0, -1), ...lobbyData});
  
      // Update the creator's document to include the new lobby
      const playerResult = await playersCollection.updateOne({ _id: new ObjectId(lobbyData.lobbyLeaderId) }, { $push: { lobbySet: lobbyResult.insertedId.toString()} });
  
      return res.status(201).json({message: "Created new lobby", _id: lobbyResult.insertedId});
  
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  });
  
  // ChatGPT usage: NO
  router.get('/:lobbyId', async (req, res) => {
    try {
      const { lobbyId } = req.params;
  
      if (!isValidObjectId(lobbyId)) {
        return res.status(400).json({ error: 'Lobby Id is invalid' });
      }
      const existingLobby = await lobbiesCollection.findOne({ _id: new ObjectId(lobbyId) });
      if (existingLobby) {
        return res.status(200).json(existingLobby);
      } else {
        return res.status(404).json({ error: 'Lobby not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  });
  
  // ChatGPT usage: NO
  router.get('/:lobbyId/lobbyName', async (req, res) => {
    try {
      const { lobbyId } = req.params;
  
      if (!isValidObjectId(lobbyId)) {
          return res.status(400).json({ error: 'Lobby Id is invalid' });
        }
  
      const existingLobby = await lobbiesCollection.findOne(
        { _id: new ObjectId(lobbyId) }, { projection: { lobbyName: true, _id: false } }
      );
  
      if (existingLobby) {
        return res.status(200).json(existingLobby);
      } else {
        return res.status(404).json({ error: 'Lobby not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  });
  
  // ChatGPT usage: NO
  router.put('/:lobbyId/player/:playerId', async (req, res) => {
    try {
      const { lobbyId, playerId } = req.params;
      const playerStats = req.body;
      const requiredFields = ['distanceCovered', 'totalArea', 'lands', 'playerName'];
  
      if (!isValidObjectId(lobbyId) ||
        !isValidObjectId(playerId) ||
        !requiredFields.every(field => field in playerStats)) {
        return res.status(400).json({ error: 'Missing parameters' });
      }
  
  
      // Check to make sure both the lobby and player exist before modifying the collections
      const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });
      const lobby = await lobbiesCollection.findOne({ _id: new ObjectId(lobbyId) });
      if (!player || !lobby) {
        return res.status(404).json({ error: 'Player or lobby not found' });
      }
      
      if (lobby.playerSet[playerId] != undefined || (player.lobbySet).includes(lobbyId)) {
        return res.status(200).json({message: "This player is already a member of this lobby"});
      }
  
      playerStats["color"] = lobby.availableColors.pop(); // check if lobby full or not
      playerStats["playerName"] = player["playerDisplayName"]
      lobby.playerSet[playerId] = playerStats;
  
      const lobbyResult = await lobbiesCollection.updateOne({ _id: new ObjectId(lobbyId) },{ $set:{playerSet: lobby.playerSet,availableColors:lobby.availableColors}});
      const playerResult = await playersCollection.updateOne({ _id: new ObjectId(playerId) }, { $push: { lobbySet: lobbyId} });
  
      return res.status(200).json({message: "Player added"});
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  });

  // ChatGPT usage: NO
  router.delete('/:lobbyId/player/:playerId', async (req, res) => {
    try {
      const { lobbyId, playerId } = req.params;
  
      if (!isValidObjectId(lobbyId) ||
        !isValidObjectId(playerId)) {
        return res.status(400).json({ error: 'Missing parameters' });
      } 
  
      // Check to make sure both the lobby and player exist before modifying the collections
      const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });
      const lobby = await lobbiesCollection.findOne({ _id: new ObjectId(lobbyId) });
      if (!player || !lobby) {
        return res.status(404).json({ error: 'Player or lobby not found' });
      }
  
      if (lobby.playerSet[playerId] == undefined || !player.lobbySet.includes(lobbyId)) {
        return res.status(200).json({message: "This player is not a member of the lobby"});
      }

      if (lobby.lobbyLeaderId === playerId) {
        return res.status(400).json({ error: 'Removing lobby leader is not supported' });
      }
  
      lobby.availableColors.push(lobby.playerSet[playerId].color); //add player color back to available colors
      delete lobby.playerSet[playerId];
  
      const lobbyResult = await lobbiesCollection.updateOne({ _id: new ObjectId(lobbyId) },{ $set:{playerSet: lobby.playerSet,availableColors: lobby.availableColors}});
      const playerResult = await playersCollection.updateOne({ _id: new ObjectId(playerId) }, { $pull: { lobbySet: lobbyId} });
  
      return res.status(200).json({message: "Player removed"});
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  });

export { router as lobbyRoutes };
