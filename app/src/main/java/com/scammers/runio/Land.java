package com.scammers.runio;

import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class Land {
    public String ownerId;
    public List<LatLng> polygonPoints;

    public Land(JSONObject landJSON) throws JSONException {
        this.ownerId = landJSON.getString("playerId");

        JSONArray jsonArray = landJSON.getJSONArray("coords");
        this.polygonPoints = new ArrayList<LatLng>();
        for (int i = 0; i < jsonArray.length(); i++) {
            try {
                String element = jsonArray.getString(i);
//                polygonPoints.add(element);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    private LatLng stringToLatLng(String coord) {
        return null;
    }

}
