package com.scammers.runio;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bumptech.glide.Glide;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Request;
import okhttp3.Response;

public class LobbyStatsActivity extends AppCompatActivity {

    final static String TAG = "LobbyStatsActivity";
    private ImageButton profileActivityButton;
    private ImageButton homeActivityButton;
    private Button addPlayerButton;
    private Lobby currentLobby;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lobby_stats);

        homeActivityButton = findViewById(R.id.home_button_lobby_stats);
        homeActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent runningIntent = new Intent(LobbyStatsActivity.this, HomeActivity.class);
                startActivity(runningIntent);
            }
        });

        profileActivityButton = findViewById(R.id.profile_image_button_lobby_stats);
        String photoUrl = MainActivity.photoUrlPublic;
        Glide.with(this).load(photoUrl).into(profileActivityButton);
        profileActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent profileIntent = new Intent(LobbyStatsActivity.this, ProfileActivity.class);
                startActivity(profileIntent);
            }
        });

        addPlayerButton = findViewById(R.id.add_player_button);

        // Retrieve the lobby ID from the intent's extras
        String lobbyId = getIntent().getStringExtra("lobbyStatsId");

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
//                    currentLobby = new Lobby(new JSONObject(response.body().string()));
                    JSONObject responseBody = new JSONObject(response.body().string());
                    String lobbyName = responseBody.getString("lobbyName");
                    String lobbyLeaderId = responseBody.getString("lobbyLeaderId");
                    TextView textView = findViewById(R.id.lobby_name_lobby_stats); // Replace with the ID of your TextView
                    textView.setText(lobbyName); // The text you want to set

                    if (!lobbyLeaderId.equals(MainActivity.currentPlayer.getPlayerId())) {
                        addPlayerButton.setVisibility(View.INVISIBLE);
                    } else {
                        // TODO SET ON CLICK LISTENER FOR ADDPLAYERBUTTON!

                    }

//                    currentLobby = new Lobby(new JSONObject(response.body().string()));
//                    TextView textView = findViewById(R.id.lobby_name); // Replace with the ID of your TextView
//                    textView.setText(currentLobby.lobbyName); // The text you want to set
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }
}