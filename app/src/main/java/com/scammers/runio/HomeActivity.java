package com.scammers.runio;

import static com.scammers.runio.MainActivity.TAG;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.media.Image;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;

import com.bumptech.glide.Glide;

public class HomeActivity extends AppCompatActivity {

    private Button startActivityButton;
    private Button lobbiesActivityButton;

    private ImageButton profileActivityButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        startActivityButton = findViewById(R.id.start_activity_button);
        startActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent runningIntent = new Intent(HomeActivity.this, RunningActivity.class);
                startActivity(runningIntent);
            }
        });

        lobbiesActivityButton = findViewById(R.id.lobbies_button_home);
        lobbiesActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent lobbiesIntent = new Intent(HomeActivity.this, LobbiesActivity.class);
                startActivity(lobbiesIntent);
            }
        });

        profileActivityButton = findViewById(R.id.profile_image_button_home);
        String photoUrl = MainActivity.photoUrlPublic;
        Glide.with(this).load(photoUrl).into(profileActivityButton);
        profileActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent profileIntent = new Intent(HomeActivity.this, ProfileActivity.class);
                startActivity(profileIntent);
            }
        });
    }
}