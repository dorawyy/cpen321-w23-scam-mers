package com.scammers.runio;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class Lobby {

    private String lobbyId = null;
    public final String lobbyName;
    public final String lobbyLeaderId;
    public HashSet<String> playerSet;

    // Called when making a new lobby
    public Lobby(String lobbyName, String lobbyLeaderId) {
        this.lobbyName = lobbyName;
        this.lobbyLeaderId = lobbyLeaderId;
        this.playerSet = new HashSet<String>();
        this.playerSet.add(lobbyLeaderId);
    }

    // Called when retrieving an existing lobby
    public Lobby(JSONObject lobbyJSON) throws JSONException {
        this.lobbyId = lobbyJSON.getString("_id");
        this.lobbyName = lobbyJSON.getString("lobbyName");
        this.lobbyLeaderId = lobbyJSON.getString("lobbyLeaderId");

        JSONArray jsonArray = lobbyJSON.getJSONArray("playerSet");
        this.playerSet = new HashSet<String>();
        for (int i = 0; i < jsonArray.length(); i++) {
            try {
                String element = jsonArray.getString(i);
                playerSet.add(element);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    public String getLobbyId() {
        return this.lobbyId;
    }

    // Deletes this lobby from db. Called when all players have left a lobby.
    public void deleteLobby() {

    }

    public void addPlayer(Player newPlayer) {
        // Push newPlayer to playerList
//        playerList.add(newPlayer.playerId);

        // Add newPlayer to lobby in db
    }

    public void removePlayer(Player removedPlayer) {
        // Remove removedPlayer from playerList
//        playerList.remove(removedPlayer.playerId);

        // Remove removedPlayer from lobby in db
    }

    public String toJSON() throws JSONException {
        JSONObject jsonObject = new JSONObject();
        JSONArray playerSetArray = new JSONArray();
        for (String item : this.playerSet) {
            playerSetArray.put(item);
        }
        jsonObject.put("lobbyName", this.lobbyName);
        jsonObject.put("lobbyLeaderId", this.lobbyLeaderId);
        jsonObject.put("playerSet", playerSetArray);
        return jsonObject.toString();
    }

}
