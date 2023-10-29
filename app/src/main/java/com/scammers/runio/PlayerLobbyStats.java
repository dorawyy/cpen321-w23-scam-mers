package com.scammers.runio;

import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.Array;
import java.util.ArrayList;
import java.util.HashSet;

public class PlayerLobbyStats {
    ArrayList<ArrayList<LatLng>> lands;
    double distanceCovered;
    double totalArea;

    public PlayerLobbyStats() {
        this.distanceCovered = 0.0;
        this.totalArea = 0.0;
        ArrayList<LatLng> list1 = new ArrayList<>();
        list1.add(new LatLng(1.0, 2.0));
        list1.add(new LatLng(3.0, 4.0));
        list1.add(new LatLng(5.0, 6.0));

        ArrayList<LatLng> list2 = new ArrayList<>();
        list2.add(new LatLng(7.0, 8.0));
        list2.add(new LatLng(9.0, 10.0));

        this.lands = new ArrayList<ArrayList<LatLng>>();
        this.lands.add(list1);
        this.lands.add(list2);
    }
    public PlayerLobbyStats(JSONObject lobbyJSON) throws JSONException {
        this.distanceCovered = lobbyJSON.getDouble("distanceCovered");
        this.totalArea = lobbyJSON.getDouble("totalArea");

        JSONArray loops = lobbyJSON.getJSONArray("lands");
        this.lands = new ArrayList<ArrayList<LatLng>>();
        for (int i = 0; i < loops.length(); i++) {
//            this.lands.add(new ArrayList<LatLng>());
            ArrayList<LatLng> newLoop = new ArrayList<LatLng>();
            JSONArray loop = loops.getJSONArray(i);
            for (int j = 0; j < loop.length(); j++) {
                try {
                    newLoop.add(new LatLng(loop.getJSONObject(j).getDouble("latitude"), loop.getJSONObject(j).getDouble("longitude")));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            this.lands.add(newLoop);
        }
    }

}