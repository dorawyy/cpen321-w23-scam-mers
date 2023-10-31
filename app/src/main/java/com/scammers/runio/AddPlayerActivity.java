package com.scammers.runio;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.ObjectWriter;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class AddPlayerActivity extends AppCompatActivity {
    final static String TAG = "AddPlayerActivity";
    final static String ADD_PLAYER_URL = "https://40.90.192.159:8081/lobby/"; //TODO CHANGE THESE
//    final static String PLAYER_ADD_LOBBY_URL = "https://40.90.192.159:8081/player/";

    EditText playerEmailInput;
    String invitedPlayerEmail;
    Button addPlayerSubmitButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_player);

        playerEmailInput = (EditText) findViewById(R.id.add_player_form);

        addPlayerSubmitButton = findViewById(R.id.add_player_submit_button);
        addPlayerSubmitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                invitedPlayerEmail = playerEmailInput.getText().toString();
                //Lobby newLobby = new Lobby(invitedPlayerEmail, MainActivity.currentPlayer.getPlayerId());
                Log.d(TAG, "invited player: " + invitedPlayerEmail);
                // TODO: Send invitedPLayerEmail to backend, where it will be added to db
                MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
//                ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

                // GET request to check if player exists
                String url = "https://40.90.192.159:8081/player/" + invitedPlayerEmail;
                Request checkPlayer = new Request.Builder()
                        .url(url)
                        .build();
                MainActivity.client.newCall(checkPlayer).enqueue(new Callback() {
                    @Override
                    public void onFailure(@NonNull Call call, @NonNull IOException e) {
                        e.printStackTrace();
                    }

                    @Override
                    public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                        Log.d(TAG, "RESPONSE CODE: " + response.code());
                        if(response.code() == 404){
                            // email not found in DB
                            Log.d(TAG, "email not found");
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    // Update UI elements here
                                    Toast.makeText(AddPlayerActivity.this, "E-Mail not registered: " + invitedPlayerEmail, Toast.LENGTH_LONG).show();
                                }
                            });
                            finish(); // maybe????
                        }
                        else if(response.code() == 200) {
                            String responseBody = response.body().string();
                            Log.d(TAG, "Response player: " + responseBody);
                            try {
                                Player invitedPlayer = new Player(new JSONObject(responseBody));
                                Log.d(TAG, "MarcID: = " + invitedPlayer.getPlayerId());
                                Log.d(TAG, "playerJSON: = " + invitedPlayer.toJSON());

                                //app.put('/lobby/:lobbyId/player/:playerId')

                                // Retrieve the lobby ID from the intent's extras
                                String lobbyId = getIntent().getStringExtra("lobbyIdAddPlayer");
                                String putPlayerUrl = "https://40.90.192.159:8081/lobby/" + lobbyId + "/player/" + invitedPlayer.getPlayerId();
                                Log.d(TAG, "Player add url:" + putPlayerUrl);
//                                RequestBody requestBody = RequestBody.create(invitedPlayer.toJSON(), mediaType);
                                PlayerLobbyStats invitedPlayerStats = new PlayerLobbyStats();
                                RequestBody requestBody = RequestBody.create(invitedPlayerStats.toJSON().toString(), mediaType);
                                Request addPlayerReq = new Request.Builder()
                                        .url(putPlayerUrl)
                                        .put(requestBody)
                                        .build();
                                MainActivity.client.newCall(addPlayerReq).enqueue(new Callback() {
                                    @Override
                                    public void onFailure(@NonNull Call call, @NonNull IOException e) {
                                        e.printStackTrace();
                                    }

                                    @Override
                                    public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                                        if (response.isSuccessful()) {
                                            // Handle the successful response here
                                            // also make sure to toast if player was already added
                                            //player was added :)
                                            Log.d(TAG, "Player added");
                                            runOnUiThread(new Runnable() {
                                                @Override
                                                public void run() {
                                                    // Update UI elements here
                                                    Toast.makeText(AddPlayerActivity.this, "Added player: " + invitedPlayerEmail, Toast.LENGTH_LONG).show();
                                                }
                                            });
                                        } else {
                                            // Handle the error response here
                                            Log.d(TAG, "Error inviting player: " + response);
                                        }
                                    }
                                });
                            } catch (JSONException e) {
                                throw new RuntimeException(e);
                            }
                        }
                        else {
                            throw new IOException("Unexpected code " + response);
                        }
                    }
                });

                // Close add player activity once finished
                finish();
            }
        });
    }
}