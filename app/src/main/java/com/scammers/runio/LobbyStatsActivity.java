package com.scammers.runio;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Request;
import okhttp3.Response;

public class LobbyStatsActivity extends AppCompatActivity {

    final static String TAG = "LobbyStatsActivity";

    private Button addPlayerButton;

    ActivityResultLauncher<Intent> startActivityIntent = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                Log.d(TAG, "CALLBACK OF ADD PLAYER. Result: " + result.getResultCode());
                if (result.getResultCode() == Activity.RESULT_OK) {
                    try {
                        Log.d(TAG, "RESULT CODE WAS OK");
                        Log.d(TAG, "RECEIVED JSON: " + result.getData().getDataString());
                        JSONObject invitedPlayerJSON =
                                new JSONObject(result.getData().getDataString());
                        PlayerLobbyStats playerStats = new PlayerLobbyStats(invitedPlayerJSON);
                        createPlayerStatsText(playerStats);
                    } catch (JSONException e) {
                        Log.e(TAG, "Malformed JSON could not be parse");
                        throw new RuntimeException(e);
                    }

                }
            }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lobby_stats);

        createViewButtons();

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

            // ChatGPT usage: Partial
            @Override
            public void onResponse(@NonNull Call call,
                                   @NonNull Response response)
                    throws IOException {
                if (response.code() != 200) {
                    throw new IOException("Unexpected code " + response);
                }
                try {
                    JSONObject responseBody =
                            new JSONObject(response.body().string());
                    Lobby currentLobby = new Lobby(responseBody);
                    TextView textView =
                            findViewById(R.id.lobby_name_lobby_stats);
                    textView.setText(currentLobby.lobbyName);
                    if (!currentLobby.lobbyLeaderId.equals(
                            MainActivity.currentPlayer.getPlayerId())) {
                        addPlayerButton.setVisibility(View.INVISIBLE);
                    } else {
                        addPlayerButton.setOnClickListener(
                                new View.OnClickListener() {
                                    @Override
                                    public void onClick(View view) {
                                        Intent addPlayerIntent = new Intent(
                                        LobbyStatsActivity.this,
                                                AddPlayerActivity.class);
                                        addPlayerIntent.putExtra(
                                            "lobbyIdAddPlayer", lobbyId);
                                        startActivityIntent.launch(addPlayerIntent);
                                    }
                                });
                    }
                    List<Map.Entry<String, PlayerLobbyStats>> playerList = new ArrayList<>(currentLobby.playerMap.entrySet());
                    playerList.sort((p1, p2) -> Double.compare(p2.getValue().totalArea, p1.getValue().totalArea));

                    // Display playerStats in screen
                    for (Map.Entry<String, PlayerLobbyStats> entry : playerList) {
                        createPlayerStatsText(entry.getValue());
                    }
                } catch (JSONException e) {
                    throw new IOException(e);
                }
            }
        });
    }

    private void createViewButtons() {
        ImageButton homeActivityButton =
                findViewById(R.id.home_button_lobby_stats);
        homeActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent runningIntent =
                        new Intent(LobbyStatsActivity.this,
                                   HomeActivity.class);
                startActivity(runningIntent);
            }
        });

        ImageButton profileActivityButton =
                findViewById(R.id.profile_image_button_lobby_stats);
        String photoUrl = MainActivity.photoUrlPublic;
        Glide.with(this).load(photoUrl).into(profileActivityButton);
        profileActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent profileIntent =
                        new Intent(LobbyStatsActivity.this,
                                   ProfileActivity.class);
                startActivity(profileIntent);
            }
        });
    }

    private void createPlayerStatsText(PlayerLobbyStats playerLobbyStats) {
        double distanceCovered =
                playerLobbyStats.distanceCovered;
        double totalArea = playerLobbyStats.totalArea;
        DecimalFormat df = new DecimalFormat("0.00");
        int color = PlayerLobbyStats.lowerAlpha(
                playerLobbyStats.color);

        LinearLayout parentLayout =
                findViewById(R.id.lobbyStatsLinearLayout);
        runOnUiThread(new Runnable() {
            // ChatGPT usage: YES
            @Override
            public void run() {
                // Create a new TextView
                TextView textView =
                        new TextView(LobbyStatsActivity.this);
                String playerName = "";
                if (playerLobbyStats.playerName != null) {
                    playerName = playerLobbyStats.playerName + "\n";
                }
                // Set text properties
                textView.setText(playerName + "Area Claimed: " +
                                         df.format(totalArea) +
                                         "km²\nKilometers " +
                                         "ran: " +
                                         df.format(
                                                 distanceCovered) +
                                         "km");
                textView.setTextSize(20);
                textView.setBackgroundColor(color);

                // Set padding
                int paddingInDp =
                        16; // Convert your padding in dp to
                // pixels
                float scale =
                        getResources().getDisplayMetrics().density;
                int paddingInPixels =
                        (int) (paddingInDp * scale + 0.5f);
                textView.setPadding(paddingInPixels,
                                    paddingInPixels,
                                    paddingInPixels,
                                    paddingInPixels);

                parentLayout.addView(textView);
            }
        });
    }
}