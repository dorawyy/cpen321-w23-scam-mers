package com.scammers.runio;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

public class LobbiesActivity extends AppCompatActivity {

    private ImageButton homeActivityButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lobbies);

        homeActivityButton = findViewById(R.id.home_button_lobbies);
        homeActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent runningIntent = new Intent(LobbiesActivity.this, HomeActivity.class);
                startActivity(runningIntent);
            }
        });
    }
}