import express from "express";
import { ObjectId } from "mongodb";
import { playersCollection, isValidObjectId } from '../helpers/mongodb.js';
import bodyParser from "body-parser";

var router = express.Router();
router.use(bodyParser.json()); 

// ChatGPT usage: PARTIAL
router.put('/:playerEmail', async (req, res) => {
  try {
    const { playerEmail } = req.params;
    const playerData = req.body;

    const existingPlayer = await playersCollection.findOne({ playerEmail: playerEmail });

    if (existingPlayer) {
      const result = await playersCollection.updateOne({ _id: new ObjectId(existingPlayer._id) }, { $set: playerData });
      return res.status(200).json({message: "Updated existing player"});
    } else {
      const result = await playersCollection.insertOne(playerData)
      return res.status(201).json({message: "Created new player", _id: result.insertedId});
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// ChatGPT usage: NO
router.put('/:playerId/fcmToken/:fcmToken', async (req, res) => {
  try {
    const { playerId, fcmToken } = req.params;

    if (!isValidObjectId(playerId) || !fcmToken) {
      return res.status(400).json({ error: 'Insufficient or invalid player data fields' });
    }

    const existingPlayer = await playersCollection.findOne({ _id: new ObjectId(playerId) });

    if (existingPlayer) {
      const result = await playersCollection.updateOne({ _id: new ObjectId(existingPlayer._id) }, { $set: {"fcmToken" : fcmToken} });
      return res.status(200).json({message: "Updated player fcmToken"});
    } else {
      return res.status(404).json({ error: 'player not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// ChatGPT usage: NO
router.get('/:player', async (req, res) => {
    try {
      const { player } = req.params;
  
      // Check if it is an email or _id
      let existingPlayer;
      if (player.indexOf('@') != -1) {
        existingPlayer = await playersCollection.findOne({ playerEmail: player });
      } else if (isValidObjectId(player)){
        existingPlayer = await playersCollection.findOne({ _id: new ObjectId(player) });
      }else{
        return res.status(400).json({ error: 'Player email or ID is invalid' });
      }
  
      if (existingPlayer) {
        return res.status(200).json(existingPlayer);
      } else {
        return res.status(404).json({ error: 'player not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  });

export { router as playerRoutes };
