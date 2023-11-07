package com.scammers.runio;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class NewLobbyActivity extends AppCompatActivity {

    final static String TAG = "NewLobby";

    final static String CREATE_LOBBY_URL = "https://40.90.192.159:8081/lobby/";

    final static String PLAYER_ADD_LOBBY_URL =
            "https://40.90.192.159:8081/player/";

    EditText lobbyNameInput;

    String newLobbyName;

    Button lobbySubmitButton;

    // ChatGPT usage: NO
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_lobby);

        lobbyNameInput = findViewById(R.id.new_lobby_name_form);

        lobbySubmitButton = findViewById(R.id.new_lobby_submit_button);
        lobbySubmitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                newLobbyName = lobbyNameInput.getText().toString();
                Lobby newLobby = new Lobby(newLobbyName,
                                   MainActivity.currentPlayer.getPlayerId());

                MediaType mediaType =
                    MediaType.parse("application/json; " +
                                            "charset=utf-8");

                try {
                    RequestBody requestBody =
                            RequestBody.create(newLobby.toJSON(), mediaType);

                    Request createLobbyReq = new Request.Builder()
                            .url(CREATE_LOBBY_URL)
                            .post(requestBody)
                            .build();

                    MainActivity.client.newCall(createLobbyReq)
                   .enqueue(new Callback() {
                       @Override
                       public void onFailure(Call call,
                                         IOException e) {
                           e.printStackTrace();
                       }

                       @Override
                       public void onResponse(Call call,
                                          Response response)
                               throws IOException {
                           if (response.isSuccessful()) {
                               // Handle the successful
                               // response here
                               try {
                                   JSONObject resBody =
                                   new JSONObject(
                                       response.body()
                                               .string());
                                   MainActivity.currentPlayer.lobbySet.add(
                                   resBody.getString("_id"));

                                   RequestBody requestBody =
                                           RequestBody.create(
                                           MainActivity.currentPlayer.toJSON(),
                                           mediaType);

                                   Request addLobbyReq =
                                       new Request.Builder()
                                       .url(PLAYER_ADD_LOBBY_URL +
                                        MainActivity.currentPlayer.playerEmail)
                                       .put(requestBody)
                                       .build();

                                   MainActivity.client.newCall(
                                       addLobbyReq)
                                      .enqueue(
                                          new Callback() {
                                              @Override
                                              public void onFailure(
                                                      Call call,
                                                      IOException e) {
                                                  e.printStackTrace();
                                              }

                                              @Override
                                              public void onResponse(
                                                  @NonNull
                                                  Call call,
                                                  @NonNull
                                                  Response response)
                                                  throws
                                                  IOException {
                                              Log.d(TAG,
                                                "Successfully added new" +
                                                " lobby to player lobby set");
                                          }
                                      });
                               } catch (JSONException e) {
                                   throw new IOException(
                                           e);
                               }
                           } else {
                               Log.d(TAG, "Error in creating " + "lobby: "
                                       + response);
                           }
                       }
                   });
                } catch (JSONException e) {
                    Log.d(TAG, "Error in creating JSON");
                }

                Toast.makeText(NewLobbyActivity.this,
                               "Created new lobby: " + newLobbyName,
                               Toast.LENGTH_LONG).show();

                finish();
            }
        });
    }
}