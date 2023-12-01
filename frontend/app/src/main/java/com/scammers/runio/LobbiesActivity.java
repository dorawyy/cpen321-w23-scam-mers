package com.scammers.runio;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Request;
import okhttp3.Response;

public class LobbiesActivity extends AppCompatActivity {

    final static String TAG = "LobbiesActivity";

    ActivityResultLauncher<Intent> startActivityIntent =
            registerForActivityResult(
                    new ActivityResultContracts.StartActivityForResult(),
                    result -> {
                        if (result.getResultCode() == Activity.RESULT_OK) {
                            String newLobbyId =
                                    result.getData().getDataString();
                            createLobbyButton(newLobbyId);
                        }
                    }
            );

    // ChatGPT usage: NO
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lobbies);

        createLobbyList();
        createViewButtons();
    }

    private void createLobbyList() {
        if (MainActivity.currentPlayer != null) {
            // Display player lobbies
            for (String lobbyId : MainActivity.currentPlayer.lobbySet) {
                createLobbyButton(lobbyId);
            }
        }
    }

    private void createLobbyButton(String lobbyId) {
        // GET request to get Lobby info
        String url = "https://40.90.192.159:8081/lobby/" + lobbyId +
                "/lobbyName";
        Request getLobby = new Request.Builder()
                .url(url)
                .build();
        MainActivity.client.newCall(getLobby).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call,
                                  @NonNull IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(@NonNull Call call,
                                   @NonNull Response response)
                    throws IOException {
                if (response.code() == 200) {
                    String responseBody = response.body().string();
                    JSONObject body = null;
                    try {
                        body = new JSONObject(responseBody);

                        // TODO Now display it
                        LinearLayout parentLayout = findViewById(
                                R.id.lobbiesLinearLayout); // Replace
                        // with your parent layout ID

                        String lobbyName =
                                body.getString("lobbyName");
                        Log.d(TAG,
                              "Creating this Lobby Button: " +
                                      lobbyName);

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                // Create a new Button
                                Button button =
                                        new Button(
                                                LobbiesActivity.this);
                                button.setText(lobbyName);


            // Add the Button to the parent layout
            parentLayout.addView(button);
            button.setOnClickListener(
                    new View.OnClickListener() {
                        @Override
                        public void onClick(
                                View view) {
                            Intent lobbyIntent =
                                    new Intent(
                                            LobbiesActivity.this,
                                            LobbyActivity.class);
                            lobbyIntent.putExtra(
                                    "lobbyId",
                                    lobbyId);
                            startActivity(
                                    lobbyIntent);
                        }
                    });
                            }
                        });


                    } catch (JSONException e) {
                        throw new IOException(e);
                    }
                } else {
                    Log.d(TAG, "Lobby not registered in DB");
                }
            }
        });
    }

    private void createViewButtons() {
        ImageButton homeActivityButton = findViewById(R.id.home_button_lobbies);
        homeActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent runningIntent =
                        new Intent(LobbiesActivity.this,
                                   HomeActivity.class);
                startActivity(runningIntent);
            }
        });

        ImageButton profileActivityButton =
                findViewById(R.id.profile_image_button_lobbies);
        String photoUrl = MainActivity.photoUrlPublic;
        Glide.with(this).load(photoUrl).into(profileActivityButton);
        profileActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent profileIntent =
                        new Intent(LobbiesActivity.this,
                                   ProfileActivity.class);
                startActivity(profileIntent);
            }
        });

        Button createLobbyButton = findViewById(R.id.create_lobby_button);
        createLobbyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent newLobbyIntent = new Intent(
                        LobbiesActivity.this,
                        NewLobbyActivity.class);

                startActivityIntent.launch(newLobbyIntent);
            }
        });
    }
}