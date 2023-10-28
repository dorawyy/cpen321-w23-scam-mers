package com.scammers.runio;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;

import com.bumptech.glide.Glide;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Request;
import okhttp3.Response;

public class LobbyActivity extends AppCompatActivity {
    private ImageButton homeActivityButton;

    private ImageButton profileActivityButton;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lobby);

        homeActivityButton = findViewById(R.id.home_button_lobby);
        homeActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent runningIntent = new Intent(LobbyActivity.this, HomeActivity.class);
                startActivity(runningIntent);
            }
        });

        profileActivityButton = findViewById(R.id.profile_image_button_lobby);
        String photoUrl = MainActivity.photoUrlPublic;
        Glide.with(this).load(photoUrl).into(profileActivityButton);
        profileActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent profileIntent = new Intent(LobbyActivity.this, ProfileActivity.class);
                startActivity(profileIntent);
            }
        });

        // Retrieve the lobby ID from the intent's extras
        String lobbyId = getIntent().getStringExtra("lobbyId");

        // GET request to get Lobby info
        String url = "https://40.90.192.159:8081/lobby/" + lobbyId;
        Request getLobby = new Request.Builder()
                .url(url)
                .build();
        MainActivity.client.newCall(getLobby).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if(response.code() != 200){
                    throw new IOException("Unexpected code " + response);
                }
                try {
                    Lobby lobby = new Lobby(new JSONObject(response.body().string()));


                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    private HashMap<String, Player> loadPlayerData(Lobby lobby) {
        HashMap<String, Player> players = new HashMap<>();
        for (String playerId : lobby.playerSet) {
            // GET request for player info
            String url = "https://40.90.192.159:8081/player/" + playerId;
            Request getLobby = new Request.Builder()
                    .url(url)
                    .build();
            MainActivity.client.newCall(getLobby).enqueue(new Callback() {
                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                    e.printStackTrace();
                }

                @Override
                public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                    if(response.code() != 200){
                        throw new IOException("Unexpected code " + response);
                    }
                    try {
                        Player player = new Player(new JSONObject(response.body().string()));
                        players.put(player.getPlayerId(), player);

                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }
                }
            });
        }
        return players;
    }
}