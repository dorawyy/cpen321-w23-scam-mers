package com.scammers.runio;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class NewLobbyActivity extends AppCompatActivity {
    final static String TAG = "NewLobby";

    EditText lobbyNameInput;
    String newLobbyName;
    Button lobbySubmitButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_lobby);

        lobbyNameInput = (EditText) findViewById(R.id.new_lobby_name_form);

        lobbySubmitButton = findViewById(R.id.new_lobby_submit_button);
        lobbySubmitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                newLobbyName = lobbyNameInput.getText().toString();

                // TODO: Create new lobby in database

                Toast.makeText(NewLobbyActivity.this, "Created new lobby: " + newLobbyName, Toast.LENGTH_LONG).show();

                // Close lobby creation activity once finished
                finish();
            }
        });
    }
}