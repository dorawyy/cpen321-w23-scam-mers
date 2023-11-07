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

    // ChatGPT usage: NO
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        checkPermissions(); // popUp for location Permissions

        Button startActivityButton = findViewById(R.id.start_activity_button);
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

        Button lobbiesActivityButton = findViewById(R.id.lobbies_button_home);
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

        ImageButton profileActivityButton =
                findViewById(R.id.profile_image_button_home);
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
            return;
        } else {
            // Creating the AlertDialog
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("Location Permission Request")
                   .setMessage(
                           "Our application requires to have access to your " +
                                   "location.")
                   .setNegativeButton("REFUSE",
                                      new DialogInterface.OnClickListener() {
                                          @Override
                                          public void onClick(
                                              DialogInterface dialogInterface,
                                                  int i) {
                                              Log.d(TAG,
                                            "NOT checking permissions" +
                                                    " !!!!");
                                              dialogInterface.dismiss(); //
                                              // Dismiss the dialog
                                              return;
                                          }
                                      })
                   .setPositiveButton("AGREE",
                      new DialogInterface.OnClickListener() {
                      public void onClick(
                              DialogInterface dialogInterface,
                              int i) {
                          // Perform action when the OK
                          // button is clicked
                          Log.d(TAG,
                                "checking permissions " +
                                        "!!!!");
                      if (ActivityCompat.shouldShowRequestPermissionRationale(
                          HomeActivity.this,
                          android.Manifest.permission.ACCESS_COARSE_LOCATION)
                          ||
                          ActivityCompat.shouldShowRequestPermissionRationale(
                                  HomeActivity.this,
                          android.Manifest.permission.ACCESS_FINE_LOCATION)) {
                              new AlertDialog.Builder(
                                      HomeActivity.this)
                              .setTitle(
                                      "Need Location Permissions")
                              .setMessage(
                                      "We need location permissions to " +
                                              "mark your location on map")
                              .setNegativeButton(
                                      "CANCEL",
                                      new DialogInterface.OnClickListener() {
                                  @Override
                                  public void onClick(
                                          DialogInterface dialogInterface,
                                          int i) {
                                      Toast.makeText(
                                           HomeActivity.this,
                                           "We need location " +
                                                   "permissions to run",
                                           Toast.LENGTH_LONG)
                                           .show();
                                      dialogInterface.dismiss();
                                  }
                              })
                              .setPositiveButton(
                                      "OK",
                              new DialogInterface.OnClickListener() {
                                  @Override
                                  public void onClick(
                                      DialogInterface dialogInterface,
                                          int i) {
                                      ActivityCompat.requestPermissions(
                                          HomeActivity.this,
                                      new String[]{
                                      android.Manifest.permission.
                                              ACCESS_COARSE_LOCATION,
                                      android.Manifest.permission.
                                              ACCESS_FINE_LOCATION},
                                      1);
                                  }
                              })
                              .create()
                              .show();
                              } else {
                                  ActivityCompat.requestPermissions(
                                  HomeActivity.this,
                                  new String[]{
                                          android.Manifest.permission.
                                                  ACCESS_COARSE_LOCATION,
                                          Manifest.permission.
                                                  ACCESS_FINE_LOCATION},
                                  1);
                              }
                              dialogInterface.dismiss(); // Dismiss the dialog
                          }
                      });

            // Creating and showing the alert dialog
            AlertDialog dialog = builder.create();
            dialog.show();
        }
    }
}