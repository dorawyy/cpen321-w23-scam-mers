package com.scammers.runio;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;

public class ProfileActivity extends AppCompatActivity {

    private ImageButton homeActivityButton;
    private ImageView profilePictureView;

    private TextView totalArea;
    private TextView totalDistance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        homeActivityButton = findViewById(R.id.home_button_profile);
        homeActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent runningIntent = new Intent(ProfileActivity.this, HomeActivity.class);
                startActivity(runningIntent);
            }
        });

        profilePictureView = findViewById(R.id.profile_picture_view);
        String photoUrl = MainActivity.photoUrlPublic;
        Glide.with(this).load(photoUrl).into(profilePictureView);

        totalArea = findViewById(R.id.profile_area_text);
        totalDistance = findViewById(R.id.profile_distance_text);
        totalArea.setText("Total Area Claimed: " + MainActivity.currentPlayer.totalAreaRan + "m^2");
        totalDistance.setText("Total Distance Ran: " + MainActivity.currentPlayer.totalDistanceRan + "m");


    }
}