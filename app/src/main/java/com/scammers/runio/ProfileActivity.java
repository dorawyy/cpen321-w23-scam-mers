package com.scammers.runio;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;

import com.bumptech.glide.Glide;

public class ProfileActivity extends AppCompatActivity {

    private ImageButton homeActivityButton;
    private ImageView profilePictureView;

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

    }
}