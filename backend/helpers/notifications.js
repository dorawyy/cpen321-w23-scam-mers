import admin from "firebase-admin";
import { ObjectId } from "mongodb";
import { lobbiesCollection, playersCollection } from "../helpers/mongodb.js";
import serviceAccount from "../runio-401718-firebase-adminsdk-ezjsi-797731a4a0.js";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

// ChatGPT usage: YES
function sendNotification(token, title, body) {
  const message = {
    data: {
      title: title,
      body: body,
    },
    token: token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
    //   console.log('Successfully sent message:', response);
    })
    .catch((error) => {
    //   console.log('Error sending message:', error);
    });
}

// ChatGPT usage: NO
export async function notifyLobby(playerId) {
  const runner = await playersCollection.findOne({ _id: new ObjectId(playerId) });
  const lobbySet = runner["lobbySet"];
  const playerIds = {};
  for (const lobby_index in lobbySet) {
    const lobby = await lobbiesCollection.findOne({ _id: new ObjectId(lobbySet[lobby_index]) });
    const playerSet = lobby.playerSet;
    const keys = Object.keys(playerSet);
    for (const key in keys) {
      let curr_playerId = keys[key];
      if (playerIds[curr_playerId] == undefined && curr_playerId != playerId) {
        let curr_player = await playersCollection.findOne({ _id: new ObjectId(curr_playerId) });
        playerIds[curr_playerId] = curr_player["fcmToken"];
      }
    }
  }
  try {
    sendNotification(runner.fcmToken, "CONGRATULATIONS!!", "You just completed a run! Keep it up! 🏆");
  } catch {
  }
  for (const playerId in playerIds) {
    console.log(playerId)
    try {
      let player_fcmToken = playerIds[playerId];
      sendNotification(player_fcmToken, runner.playerDisplayName + " just completed a run!", "Keep running to catch up. 🏃🔥");
    } catch {
    }
  }
}

