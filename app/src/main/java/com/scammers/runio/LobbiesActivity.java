package com.scammers.runio;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;

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
    private ImageButton homeActivityButton;
    private Button createLobbyButton;

    private ImageButton profileActivityButton;

    // ChatGPT usage: NO
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lobbies);

        // Display player lobbies
        for (String lobbyId : MainActivity.currentPlayer.lobbySet) {
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
                              "Creating this Lobby Button: " + lobbyName);

                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    // Create a new Button
                                    Button button =
                                        new Button(LobbiesActivity.this);
                                    button.setText(lobbyName);

                                    // Set any additional properties for the
                                    // Button as needed
                                    // button.setLayoutParams(new
                                    // LinearLayout.LayoutParams(LinearLayout
                                    // .LayoutParams.WRAP_CONTENT,
                                    // LinearLayout.LayoutParams.WRAP_CONTENT));

                                    // Add the Button to the parent layout
                                    parentLayout.addView(button);
                                    button.setOnClickListener(
                                    new View.OnClickListener() {
                                        @Override
                                        public void onClick(View view) {
                                            Intent lobbyIntent =
                                            new Intent(
                                            LobbiesActivity.this,
                                                        LobbyActivity.class);
                                            lobbyIntent.putExtra(
                                                    "lobbyId", lobbyId);
                                            startActivity(lobbyIntent);
                                        }
                                    });
                                }
                            });


                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                    } else {
                        Log.d(TAG, "Lobby not registered in DB");
                    }
                }
            });
        }

        homeActivityButton = findViewById(R.id.home_button_lobbies);
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

        profileActivityButton = findViewById(R.id.profile_image_button_lobbies);
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

        createLobbyButton = findViewById(R.id.create_lobby_button);
        createLobbyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                // Display lobby creator as popup
//                LayoutInflater inflater = (LayoutInflater) getSystemService
//                (LAYOUT_INFLATER_SERVICE);
//                View popupView = inflater.inflate(R.layout
//                .activity_new_lobby, null);
//
//                int width = LinearLayout.LayoutParams.WRAP_CONTENT;
//                int height = LinearLayout.LayoutParams.WRAP_CONTENT;
//                final PopupWindow createLobbyPopup = new PopupWindow
//                (popupView, width, height, true);
//
//                createLobbyPopup.showAtLocation(view, Gravity.CENTER, 0, 0);
//
//                popupView.setOnTouchListener(new View.OnTouchListener() {
//                    @Override
//                    public boolean onTouch(View view, MotionEvent
//                    motionEvent) {
//                        createLobbyPopup.dismiss();
//                        return true;
//                    }
//                });
                Intent newLobbyIntent = new Intent(
                            LobbiesActivity.this,
                                         NewLobbyActivity.class);
                startActivity(newLobbyIntent);
            }
        });
    }
}