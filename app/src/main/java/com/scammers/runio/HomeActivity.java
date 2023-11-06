package com.scammers.runio;

import static com.scammers.runio.MainActivity.TAG;

import android.Manifest;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;

public class HomeActivity extends AppCompatActivity {

    private Button startActivityButton;
    private Button lobbiesActivityButton;

    private ImageButton profileActivityButton;
    private Button locationButton;

    // ChatGPT usage: NO
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        locationButton = findViewById(R.id.location_button);
        locationButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkPermissions();
                Log.d(TAG, "Trying to request location permission");
                Toast.makeText(HomeActivity.this,
                               "Trying to request location permissions",
                               Toast.LENGTH_LONG).show();
            }
        });

        startActivityButton = findViewById(R.id.start_activity_button);
        startActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent runningIntent =
                        new Intent(HomeActivity.this,
                                   RunningActivity.class);
                startActivity(runningIntent);
            }
        });

        lobbiesActivityButton = findViewById(R.id.lobbies_button_home);
        lobbiesActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent lobbiesIntent =
                        new Intent(HomeActivity.this,
                                   LobbiesActivity.class);
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
                Intent profileIntent =
                        new Intent(HomeActivity.this,
                                   ProfileActivity.class);
                startActivity(profileIntent);
            }
        });
    }

    // ChatGPT usage: NO
    private void checkPermissions() {
        if (ContextCompat.checkSelfPermission(this,
            android.Manifest.permission.ACCESS_COARSE_LOCATION) ==
            PackageManager.PERMISSION_GRANTED
            && ContextCompat.checkSelfPermission(this,
            android.Manifest.permission.ACCESS_FINE_LOCATION) ==
            PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "We got location thanks!",
                           Toast.LENGTH_LONG)
                 .show();
        } else {
            if (ActivityCompat.shouldShowRequestPermissionRationale(this,
                android.Manifest.permission.ACCESS_COARSE_LOCATION)
                || ActivityCompat.shouldShowRequestPermissionRationale(this,
                android.Manifest.permission.ACCESS_FINE_LOCATION)) {
                new AlertDialog.Builder(this)
                        .setTitle("Need Location Permissions")
                        .setMessage(
                                "We need location permissions to mark your " +
                                        "location on map")
                        .setNegativeButton("CANCEL",
                           new DialogInterface.OnClickListener() {
                               @Override
                               public void onClick(
                                       DialogInterface dialogInterface,
                                       int i) {
                                   Toast.makeText(
                                                HomeActivity.this,
                                                "Need location permissions",
                                                Toast.LENGTH_LONG)
                                        .show();
                                   dialogInterface.dismiss();
                               }
                           })
                        .setPositiveButton("OK",
                       new DialogInterface.OnClickListener() {
                       @Override
                       public void onClick(
                               DialogInterface dialogInterface,
                               int i) {
                           ActivityCompat.requestPermissions(
                           HomeActivity.this,
                           new String[]{
                           android.Manifest.permission.ACCESS_COARSE_LOCATION,
                           android.Manifest.permission.ACCESS_FINE_LOCATION},
                           1);
                       }
                       })
                        .create()
                        .show();
            } else {
                ActivityCompat.requestPermissions(this, new String[]{
                        android.Manifest.permission.ACCESS_COARSE_LOCATION,
                        Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            }
        }
    }
}