package com.scammers.runio;

import com.google.android.gms.maps.model.LatLng;

import java.util.ArrayList;

public class Run {
    private String playerId;
    private double NEW_COORD_THRESHOLD = 5.0 / 111139.0;
    private double COMPLETE_LOOP_THRESHOLD = 40.0 / 111139.0;
    ArrayList<LatLng> path;
    public Run(String playerId) {
        this.playerId = playerId;
        this.path = new ArrayList<LatLng>();
    }

    public void addCoordinate(LatLng coord) {
        path.add(coord);
    }

    public boolean isNewCoord(LatLng coord) {
        return path.size() == 0 || distance(path.get(path.size() - 1), coord) > NEW_COORD_THRESHOLD;
    }

    public boolean isCompleteLoop() {
        if (path.size() <= 1) {
            return false;
        }
        LatLng start = path.get(0);
        LatLng end = path.get(path.size() - 1);
        return distance(start, end) < COMPLETE_LOOP_THRESHOLD;
    }

    private double distance(LatLng start, LatLng end) {
        return Math.sqrt(Math.pow(start.longitude - end.longitude, 2)
                + Math.pow(start.latitude - end.latitude, 2));
    }
}
