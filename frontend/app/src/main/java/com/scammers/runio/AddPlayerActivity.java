package com.scammers.runio;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.Gson;

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

    EditText playerEmailInput;

    String invitedPlayerEmail;

    Button addPlayerSubmitButton;

    // ChatGPT usage: NO
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_player);

        playerEmailInput = findViewById(R.id.add_player_form);

        addPlayerSubmitButton = findViewById(R.id.add_player_submit_button);
        addPlayerSubmitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                invitedPlayerEmail = playerEmailInput.getText().toString();
                Log.d(TAG, "invited player: " + invitedPlayerEmail);
                MediaType mediaType =
                    MediaType.parse("application/json; " +
                                                "charset=utf-8");

                // GET request to check if player exists
                String url = "https://40.90.192.159:8081/player/" +
                        invitedPlayerEmail;
                Request checkPlayer = new Request.Builder()
                        .url(url)
                        .build();
                MainActivity.client.newCall(checkPlayer)
               .enqueue(new Callback() {
                   @Override
                   public void onFailure(@NonNull Call call,
                                         @NonNull
                                         IOException e) {
                       e.printStackTrace();
                   }

                   @Override
                   public void onResponse(
                           @NonNull Call call,
                           @NonNull Response response)
                           throws IOException {
                       Log.d(TAG, "RESPONSE CODE: " +
                               response.code());
                       if (response.code() == 404) {
                           // email not found in DB
                           Log.d(TAG, "email not found");
                           runOnUiThread(new Runnable() {
                               @Override
                               public void run() {
                                   // Update UI elements
                                   // here
                                   Toast.makeText(
                                                AddPlayerActivity.this,
                                                "E-Mail not registered: " +
                                                        invitedPlayerEmail,
                                                Toast.LENGTH_LONG)
                                        .show();
                               }
                           });
                           finish(); // maybe????
                       } else if (response.code() == 200) {
                           String responseBody =
                                   response.body().string();
                           Log.d(TAG, "Response player: " +
                                   responseBody);
                           try {
                               Player invitedPlayer =
                                       new Player(
                                               new JSONObject(
                                                       responseBody));

                               //app.put('/lobby/:lobbyId
                               // /player/:playerId')
                               // Retrieve the lobby ID
                               // from the intent's extras
                               String lobbyId =
                                       getIntent().getStringExtra(
                                               "lobbyIdAddPlayer");
                               String putPlayerUrl =
                                       "https://40.90.192" +
                                               ".159:8081" +
                                               "/lobby/" +
                                               lobbyId +
                                               "/player/" +
                                               invitedPlayer.getPlayerId();
                               Log.d(TAG,
                                     "Player add url:" +
                                             putPlayerUrl);
                               Gson gson = new Gson();
                               String invitedPlayerName =
                                       gson.fromJson(
                                               responseBody,
                                               Player.class).playerDisplayName;
                               PlayerLobbyStats
                                       invitedPlayerStats =
                                       new PlayerLobbyStats(
                                               invitedPlayerName);

                               RequestBody requestBody =
                                       RequestBody.create(
                                               invitedPlayerStats.toJSON()
                                                                 .toString(),
                                               mediaType);
                               Request addPlayerReq =
                                       new Request.Builder()
                                               .url(putPlayerUrl)
                                               .put(requestBody)
                                               .build();
                               MainActivity.client.newCall(
               addPlayerReq)
              .enqueue(
                      new Callback() {
                          @Override
                          public void onFailure(
                                  @NonNull
                                  Call call,
                                  @NonNull
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
                              if (response.isSuccessful()) {
                                  //Handlesuccessfulresponse
                                  Log.d(TAG,
                                        "Player added");
                                  runOnUiThread(
                          new Runnable() {
                              @Override
                              public void run() {
                                  // Update UI elements
                                  Toast.makeText(
                                               AddPlayerActivity.this,
                                               "Added player: " +
                                                       invitedPlayerEmail,
                                               Toast.LENGTH_LONG)
                                       .show();
                              }
                          });
                                  Intent
                                          resultIntent =
                                          new Intent();
                                  Log.d(TAG,
                                        "INVITED PLAYER: " +
                                                gson.toJson(
                                                        invitedPlayerStats));
                                  resultIntent.setData(
                                          Uri.parse(
                                                  gson.toJson(
                                                          invitedPlayerStats)));
                                  resultIntent.putExtra(
                                          "invitedPlayerId",
                                          invitedPlayer.getPlayerId());
                                  setResult(
                                          RESULT_OK,
                                          resultIntent);
                                  finish();
                              } else {
                                  // Handle error response
                                  Log.d(TAG,
                                        "Error inviting player: " +
                                                response);
                              }
                          }
                      });
                           } catch (JSONException e) {
                               throw new IOException(e);
                           }
                       } else {
                           throw new IOException(
                                   "Unexpected code " +
                                           response);
                       }
                   }
               });
            }
        });
    }
}