package com.scammers.runio;

import android.graphics.Color;

import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class PlayerLobbyStats {

    private static final int ALPHA_MASK_100 = (100 << 24) | 0xFFFFFF;

    public final double distanceCovered;

    public final double totalArea;

    public final int color;

    public final ArrayList<ArrayList<LatLng>> lands;

    // ChatGPT usage: Partial
    public PlayerLobbyStats() {
        this.distanceCovered = 0.0;
        this.totalArea = 0.0;
        this.color = Color.WHITE;
        this.lands = new ArrayList<ArrayList<LatLng>>();
    }

    // ChatGPT usage: Partial
    public PlayerLobbyStats(JSONObject playerStatsJSON) throws JSONException {
        this.distanceCovered = playerStatsJSON.getDouble("distanceCovered");
        this.totalArea = playerStatsJSON.getDouble("totalArea");
        this.color = playerStatsJSON.getInt("color");
        this.lands = new ArrayList<>();
        JSONArray landsJSON = playerStatsJSON.getJSONArray("lands");

        for (int i = 0; i < landsJSON.length(); i++) {
            JSONArray landArrayJSON = landsJSON.getJSONArray(i);
            ArrayList<LatLng> coordinates = new ArrayList<>();
            for (int j = 0; j < landArrayJSON.length(); j++) {
                JSONObject coordinateJSON = landArrayJSON.getJSONObject(j);
                double latitude = coordinateJSON.getDouble("latitude");
                double longitude = coordinateJSON.getDouble("longitude");
                coordinates.add(new LatLng(latitude, longitude));
            }
            lands.add(coordinates);
        }
    }

    // ChatGPT usage: Partial
    public JSONObject toJSON() throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("distanceCovered", distanceCovered);
        jsonObject.put("totalArea", totalArea);
        // intentionally left out color because it should be assigned by the
        // backend.

        JSONArray landsArray = new JSONArray();
        for (ArrayList<LatLng> land : lands) {
            JSONArray landArray = new JSONArray();
            for (LatLng coordinate : land) {
                JSONObject coordinateJson = new JSONObject();
                coordinateJson.put("latitude", coordinate.latitude);
                coordinateJson.put("longitude", coordinate.longitude);
                landArray.put(coordinateJson);
            }
            landsArray.put(landArray);
        }
        jsonObject.put("lands", landsArray);

        return jsonObject;
    }

    // ChatGPT usage: NO
    public static int lowerAlpha(int color) {
        return ALPHA_MASK_100 & color;
    }
}