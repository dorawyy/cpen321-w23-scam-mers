package com.scammers.runio;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

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
    final static String TAG = "AddPlayer";
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

                // TODO: Send invitedPLayerEmail to backend, where it will be added to db
                MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
                ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

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
                        if(response.code() == 404){
                            // email not found in DB
                            Toast.makeText(AddPlayerActivity.this, "E-Mail not registered: " + invitedPlayerEmail, Toast.LENGTH_LONG).show();
                        } else if(response.code() == 200) {
                            String responseBody = response.body().string();
                            JSONObject body = null;
                            try {
                                body = new JSONObject(responseBody);
                                String newPlayerJSON = ow.writeValueAsString(body);
                                Log.d(TAG, "GET Player response: " + body.getString("_id") + body.getString("playerEmail")
                                        + body.getString("playerDisplayName") + body.getString("playerPhotoUrl"));

                                //TODO
                                // After getting playerId,
                                // Use given lobbyId to get Lobby then
                                // put it in lobby
                                RequestBody requestBody = RequestBody.create(newPlayerJSON, mediaType);
                                Request addPlayerReq = new Request.Builder()
                                        .url(ADD_PLAYER_URL)
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

                                        } else {
                                            // Handle the error response here
                                            Log.d(TAG, "Error in creating lobby: " + response);
                                        }
                                    }
                                });
                            } catch (JSONException e) {
                                throw new RuntimeException(e);
                            }
                        } else {
                            throw new IOException("Unexpected code " + response);
                        }
                    }
                });

                Toast.makeText(AddPlayerActivity.this, "Created new lobby: " + invitedPlayerEmail, Toast.LENGTH_LONG).show();

                // Close add player activity once finished
                finish();
            }
        });
    }
}