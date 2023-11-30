package com.scammers.runio;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
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

    final static String TAG = "NewLobbyActivity";

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
        lobbyNameInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                // No implementation needed
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                // Enable the button only if the lobby name is not empty
                lobbySubmitButton.setEnabled(!charSequence.toString().trim().isEmpty());
            }

            @Override
            public void afterTextChanged(Editable editable) {
                // No implementation needed
            }
        });

        lobbySubmitButton = findViewById(R.id.new_lobby_submit_button);
        lobbySubmitButton.setEnabled(false);
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
                                   String lobbyId = resBody.getString("_id");
                                   MainActivity.currentPlayer.lobbySet.add(lobbyId);

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
                                                  finish();
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
                                                "Successfully added new lobby to player lobby set. lobbyId: " + lobbyId);
                                              runOnUiThread(new Runnable() {
                                                  @Override
                                                  public void run() {
                                                      Toast.makeText(
                                                              NewLobbyActivity.this,
                                                              "Created new lobby: " + newLobbyName,
                                                              Toast.LENGTH_LONG).show();
                                                  }
                                              });
                                              Intent resultIntent = new Intent();

                                              resultIntent.setData(
                                                      Uri.parse(lobbyId));
//                                              resultIntent.putExtra("newLobbyId", lobbyId);
                                              setResult(RESULT_OK, resultIntent);
                                              finish();
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
            }
        });
    }
}