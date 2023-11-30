import { ObjectId } from "mongodb";
import * as turf from "@turf/turf";
import { lobbiesCollection, playersCollection } from "../helpers/mongodb.js";


// Helper function for updating a player's map in a specified lobby.
// playerId: Id of player who's map will be updated.
// newMap: The map which will replace the existing one. Stored as an array of shapes made up of coordinates.
// lobbyId: Id of lobby where map will be updated
// ChatGPT usage: NO
export async function updateMapInLobby(playerId, newMap, lobbyId) {
  let query = "playerSet." + playerId;
  let setTarget = "playerSet." + playerId + ".lands";
  await lobbiesCollection.updateOne(
    { _id: new ObjectId(lobbyId), [query]: { $exists: true } }, { $set: { [setTarget]: newMap } }
  );
}

// ChatGPT usage: NO
function pathToPolygon(path) {
  let pointList = [];
  for (let point in path) {
    if (path[point]["latitude"] && path[point]["longitude"]) {
      let lat = path[point]["latitude"];
      let long = path[point]["longitude"];
      pointList.push([lat, long]);
    }
  }
  pointList = [pointList];
  let pathPolygon = turf.polygon(pointList);
  return pathPolygon;
}

// ChatGPT usage: NO
function polygonToLand(poly) {
  let land = [];
  for (let i in poly.geometry.coordinates[0]) {
    let coordObj = {
      "latitude": poly.geometry.coordinates[0][i][0],
      "longitude": poly.geometry.coordinates[0][i][1],
    };
    land.push(coordObj);
  }
  return land;
}

// ChatGPT usage: NO
function polygonToLand2(poly) {
  let land = [];
  for (let i in poly[0]) {
    let coordObj = {
      "latitude": poly[0][i][0],
      "longitude": poly[0][i][1],
    };
    land.push(coordObj);
  }
  return land;
}

// ChatGPT usage: NO
function unionLand(oldLand, newLand, player, lobby) {
  if (!oldLand || oldLand.length === 0) {
    let updatedLandSet = [];
    updatedLandSet.push(polygonToLand(pathToPolygon(newLand)));
    updateMapInLobby(player._id, updatedLandSet, lobby._id);
    return updatedLandSet;
  }
  let updatedLandSet = [];
  let union = pathToPolygon(newLand);
  for (let i in oldLand) {
    let oldPoly = pathToPolygon(oldLand[i]);

    let temp = turf.union(oldPoly, union);
    // If the union is one polygon update union
    if (temp.geometry["type"] === "Polygon") {
      union = temp;
    }
    else {
      updatedLandSet.push(oldLand[i]);
    }
  }
  // Finally push the union
  updatedLandSet.push(polygonToLand(union));
  updateMapInLobby(player._id, updatedLandSet, lobby._id);

  return updatedLandSet;
}

// ChatGPT usage: NO
function subtractLand(addedLand, lobby, playerId) {
  for (let [oppId, oppData] of Object.entries(lobby["playerSet"])) {
    if (oppId != playerId) {
      let oppLandSet = oppData["lands"];
      let updatedLandSet = [];
      for (let i in oppLandSet) {
        let oppLand = oppLandSet[i];
        let oldPoly = pathToPolygon(oppLand);
        let newPoly = pathToPolygon(addedLand);
        let updatedOppPoly = turf.difference(oldPoly, newPoly);
        if (updatedOppPoly) {
          if (updatedOppPoly.geometry["type"] == "MultiPolygon") {
            for (i in updatedOppPoly.geometry.coordinates) {
              updatedLandSet.push(polygonToLand2(updatedOppPoly.geometry.coordinates[i])); // use polygonToLand2 function here
            }
          } else {
            updatedLandSet.push(polygonToLand(updatedOppPoly));
          }
        }
      }
      updateMapInLobby(oppId, updatedLandSet, lobby._id);

    }
  };
}

// ChatGPT usage: NO
export async function updateLobbyMaps(playerId, addedLand) {
  const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });
  if (player) {
    const playerLobbies = player["lobbySet"];
    for (let i in playerLobbies) {
      let newLand;
      let lobbyId = new ObjectId(playerLobbies[i]);
      let lobby = await lobbiesCollection.findOne({ _id: lobbyId });
      let oldLand = lobby.playerSet[playerId]["lands"];
      newLand = unionLand(oldLand, addedLand, player, lobby);
      subtractLand(addedLand, lobby, playerId);
    }
  }
}

// ChatGPT usage: NO
export async function updatePlayerStats(playerId, pathArea, pathDist) {
  const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });
  if (player) {
    player.totalAreaRan += pathArea;
    player.totalDistanceRan += pathDist;

    const result = await playersCollection.updateOne({ _id: player._id }, { $set: { totalAreaRan: player.totalAreaRan, totalDistanceRan: player.totalDistanceRan } });

    if (result.modifiedCount === 1) {
      const playerLobbies = player["lobbySet"];
      for (let i in playerLobbies) {
        updatePlayerLobbyStats(playerLobbies[i], playerId, pathArea, pathDist);
      }
    } else {
    }
  }
  else {
  }
}

// ChatGPT usage: NO
async function updatePlayerLobbyStats(lobbyId, playerId, pathArea, pathDist) {
  const lobby = await lobbiesCollection.findOne({ _id: new ObjectId(lobbyId) });

  if (lobby) {
    const player = lobby.playerSet[playerId];
    if (player) {
      // Update the player's distance and area
      player.distanceCovered += pathDist;
      player.totalArea += pathArea;

      // Update the playerSet in the lobby
      lobby.playerSet[playerId] = player;

      const updateLobbyResult = await lobbiesCollection.updateOne({ _id: lobby._id }, { $set: { playerSet: lobby.playerSet } });

      if (updateLobbyResult.modifiedCount === 1) {
        // console.log(`Player stats updated in lobby: ${lobbyId}`);
      } else {
        // console.log(`Failed to update player stats in lobby: ${lobbyId}`);
      }
    } else {
      // console.log(`Player with ID ${playerId} not found in lobby: ${lobbyId}`);
    }
  } else {
    // console.log(`Lobby with ID ${lobbyId} not found.`);
  }
}