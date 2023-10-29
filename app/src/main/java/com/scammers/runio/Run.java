package com.scammers.runio;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.maps.model.LatLng;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.ArrayList;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

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

    public void end(){
        /*
        * This method will check if the player has run a valid loop and if so,
        * it will update the state of the map (Map.update()).  This state must
        * be sent to every player in the lobby. Each player will be notified when
        * someone finishes an activity.
        *
        * This can send API call to backend with the path
        * */

        // Connect path to starting point to complete polygon
        this.path.add(path.get(0));

        String url = "https://40.90.192.159:8081/player/" + this.playerId + "/run";
        MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
        Gson gson = new Gson();
        String pathJSON = gson.toJson(this.path);
        Log.d("Run", "path:" + pathJSON);
        RequestBody requestBody = RequestBody.create(pathJSON, mediaType);
        Request sendRun = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();

        MainActivity.client.newCall(sendRun).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {

            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                Log.d("Run", "run response:" + response.body().string());
            }
        });

    }
}
