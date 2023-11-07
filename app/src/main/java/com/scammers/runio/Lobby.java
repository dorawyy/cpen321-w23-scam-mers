package com.scammers.runio;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;

public class Lobby {

    private String lobbyId = null;

    public final String lobbyName;

    public final String lobbyLeaderId;

    public HashMap<String, PlayerLobbyStats> playerMap;

    // ChatGPT usage: NO
    public Lobby(String lobbyName, String lobbyLeaderId) {
        this.lobbyName = lobbyName;
        this.lobbyLeaderId = lobbyLeaderId;
        this.playerMap = new HashMap<String, PlayerLobbyStats>();
        this.playerMap.put(lobbyLeaderId, new PlayerLobbyStats());
    }

    // ChatGPT usage: Partial
    public Lobby(JSONObject lobbyJSON) throws JSONException {
        this.lobbyId = lobbyJSON.getString("_id");
        this.lobbyName = lobbyJSON.getString("lobbyName");
        this.lobbyLeaderId = lobbyJSON.getString("lobbyLeaderId");

        JSONObject playerMapJSON = lobbyJSON.getJSONObject("playerSet");
        this.playerMap = new HashMap<>();

        Iterator<String> keys = playerMapJSON.keys();
        while (keys.hasNext()) {
            String playerId = keys.next();
            JSONObject playerStatsJSON = playerMapJSON.getJSONObject(playerId);
            PlayerLobbyStats playerStats =
                    new PlayerLobbyStats(playerStatsJSON);
            playerMap.put(playerId, playerStats);
        }
    }

    // ChatGPT usage: NO
    public String getLobbyId() {
        return this.lobbyId;
    }

    // ChatGPT usage: Partial
    public String toJSON() throws JSONException {
        JSONObject jsonObject = new JSONObject();
        JSONObject playerSetObject = new JSONObject();

        for (String playerId : this.playerMap.keySet()) {
            PlayerLobbyStats playerStats = this.playerMap.get(playerId);
            assert playerStats != null;
            JSONObject playerStatsJson = playerStats.toJSON();
            playerSetObject.put(playerId, playerStatsJson);
        }

        jsonObject.put("lobbyName", this.lobbyName);
        jsonObject.put("lobbyLeaderId", this.lobbyLeaderId);
        jsonObject.put("playerSet", playerSetObject);

        return jsonObject.toString();
    }

}
