package com.scammers.runio;

import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;

public class PlayerLobbyStats {
    public final double distanceCovered;
    public final double totalArea;
    public final ArrayList<ArrayList<LatLng>> lands;

//    public PlayerLobbyStats() {
//        this.distanceCovered = 0.0;
//        this.totalArea = 0.0;
//        ArrayList<LatLng> list1 = new ArrayList<>();
//        list1.add(new LatLng(1.0, 2.0));
//        list1.add(new LatLng(3.0, 4.0));
//        list1.add(new LatLng(5.0, 6.0));
//
//        ArrayList<LatLng> list2 = new ArrayList<>();
//        list2.add(new LatLng(7.0, 8.0));
//        list2.add(new LatLng(9.0, 10.0));
//
//        this.lands = new ArrayList<ArrayList<LatLng>>();
//        this.lands.add(list1);
//        this.lands.add(list2);
//    }
//    public PlayerLobbyStats(JSONObject lobbyJSON) throws JSONException {
//        this.distanceCovered = lobbyJSON.getDouble("distanceCovered");
//        this.totalArea = lobbyJSON.getDouble("totalArea");
//
//        JSONArray loops = lobbyJSON.getJSONArray("lands");
//        this.lands = new ArrayList<ArrayList<LatLng>>();
//        for (int i = 0; i < loops.length(); i++) {
////            this.lands.add(new ArrayList<LatLng>());
//            ArrayList<LatLng> newLoop = new ArrayList<LatLng>();
//            JSONArray loop = loops.getJSONArray(i);
//            for (int j = 0; j < loop.length(); j++) {
//                try {
//                    newLoop.add(new LatLng(loop.getJSONObject(j).getDouble("latitude"), loop.getJSONObject(j).getDouble("longitude")));
//                } catch (JSONException e) {
//                    e.printStackTrace();
//                }
//            }
//            this.lands.add(newLoop);
//        }
//    }

    public PlayerLobbyStats() {
        this.distanceCovered = 0.0;
        this.totalArea = 0.0;
        this.lands = new ArrayList<ArrayList<LatLng>>();
    }

    public PlayerLobbyStats(JSONObject playerStatsJSON) throws JSONException {
        this.distanceCovered = playerStatsJSON.getDouble("distanceCovered");
        this.totalArea = playerStatsJSON.getDouble("totalArea");
        this.lands = new ArrayList<>();
        JSONArray landsJSON = playerStatsJSON.getJSONArray("lands");

        for (int i = 0; i < landsJSON.length(); i++) {
            JSONArray landArrayJSON = landsJSON.getJSONArray(i);
            ArrayList<LatLng> coordinates = new ArrayList<>();
            for (int j = 0; j < landArrayJSON.length(); j++) {
                JSONObject coordinateJSON = landArrayJSON.getJSONObject(j);
                int latitude = coordinateJSON.getInt("latitude");
                int longitude = coordinateJSON.getInt("longitude");
                coordinates.add(new LatLng(latitude, longitude));
            }
            lands.add(coordinates);
        }
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("distanceCovered", distanceCovered);
        jsonObject.put("totalArea", totalArea);

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

}