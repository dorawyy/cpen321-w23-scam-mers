package com.scammers.runio;

import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.HashSet;

public class Player {

    private String playerId = null;
    public final String playerEmail;
    public final String playerPhotoUrl;
    public final String playerDisplayName;
    public HashSet<String> lobbySet;


    // Called when making a new player
    public Player(GoogleSignInAccount account) {
        this.playerEmail = account.getEmail();
        this.playerPhotoUrl = String.valueOf(account.getPhotoUrl());
        this.playerDisplayName = account.getDisplayName();
        this.lobbySet = new HashSet<String>();
    }

    // Called when retrieving an existing player
    public Player(JSONObject playerJSON) throws JSONException {
        this.playerEmail = playerJSON.getString("playerEmail");
        this.playerPhotoUrl = playerJSON.getString("playerPhotoUrl");
        this.playerDisplayName = playerJSON.getString("playerDisplayName");
        this.playerId = playerJSON.getString("_id");

        JSONArray jsonArray = playerJSON.getJSONArray("lobbySet");
        this.lobbySet = new HashSet<String>();
        for (int i = 0; i < jsonArray.length(); i++) {
            try {
                String element = jsonArray.getString(i);
                lobbySet.add(element);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    public String getPlayerId() {
        return this.playerId;
    }
    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String toJSON() throws JSONException {
        JSONObject jsonObject = new JSONObject();
        JSONArray lobbySetArray = new JSONArray();
        for (String item : this.lobbySet) {
            lobbySetArray.put(item);
        }
        jsonObject.put("lobbySet", lobbySetArray);
        jsonObject.put("playerEmail", this.playerEmail);
        jsonObject.put("playerDisplayName", this.playerDisplayName);
        jsonObject.put("playerPhotoUrl", this.playerPhotoUrl);
        return jsonObject.toString();
    }
}
