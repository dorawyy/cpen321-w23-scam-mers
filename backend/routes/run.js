import express from "express";
import bodyParser from "body-parser";
// import { computeArea, computeLength } from "spherical-geometry-js";
// import { sphericalPolygonArea, sphericalPolygonLength } from "../helpers/geometry.js"
import computeArea from "../helpers/spherical-geometry-js/compute-area.js";
import computeLength from "../helpers/spherical-geometry-js/compute-length.js";
import { isValidObjectId } from "../helpers/mongodb.js";
import { updateLobbyMaps, updatePlayerStats } from "../helpers/run.js";
import { notifyLobby } from "../helpers/notifications.js";

var router = express.Router();
router.use(bodyParser.json()); // Add this line to enable JSON body parsing

// ChatGPT usage: NO
router.post('/player/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const playerRun = req.body;
    if (!isValidObjectId(playerId) || !playerRun) {
      return res.status(400).json({ error: 'Insufficient player run fields' });
    }

    // Analyze run and update statistics, maps, etc.
    const pathArea = computeArea(playerRun) / 1000000; // Update this in every lobby player is in. Lobbyarea += area
    const pathDist = computeLength(playerRun) / 1000; // Update this in every lobby player is in. LobbyDist += dist
    // const pathArea = sphericalPolygonArea(playerRun); // Update this in every lobby player is in. Lobbyarea += area
    // const pathDist = sphericalPolygonLength(playerRun); // Update this in every lobby player is in. LobbyDist += dist
    // console.log("AREA: " + pathArea)
    // console.log("Dist: " + pathDist)

    await updateLobbyMaps(playerId, playerRun);
    await updatePlayerStats(playerId, pathArea, pathDist); // Update personal stats and lobby stats(distance and total area)
    await notifyLobby(playerId);
    return res.status(200).json({ message: "Run successfully recorded", area: pathArea, distance: pathDist});
  } catch (error) {
    console.log("ERROR:" + error)
    return res.status(500).json({ error: 'Server error' });
  }
});

export { router as runRoutes };