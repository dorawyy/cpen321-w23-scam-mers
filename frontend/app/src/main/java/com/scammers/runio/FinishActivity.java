package com.scammers.runio;

import androidx.core.app.ActivityCompat;
import androidx.fragment.app.FragmentActivity;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.PolygonOptions;

import java.util.ArrayList;

public class FinishActivity extends FragmentActivity
        implements OnMapReadyCallback {

    private final String TAG = "FinishActivity";
    ArrayList<LatLng> path;

    double distanceRan;

    double areaRan;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_finish);

//        path = getIntent().getParcelableArrayListExtra("path");
//        distanceRan = getIntent().getDoubleExtra("distanceRan", 0.0);
//        areaRan = getIntent().getDoubleExtra("areaRan", 0.0);
//        Log.d(TAG, "Area: " + areaRan);
//        Log.d(TAG, "Dist: " + distanceRan);
//        String statsText = "You ran an area of " + areaRan + " km² and a distance of " + distanceRan + " km!";
//        TextView textStats = findViewById(R.id.text_stats);
//        textStats.setText(statsText);
//        Log.d(TAG, "PATH: " + path);

        ImageButton homeActivityButton = findViewById(R.id.home_button_finish);
        homeActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent runningIntent =
                        new Intent(FinishActivity.this,
                                   HomeActivity.class);
                startActivity(runningIntent);
            }
        });

        ImageButton profileActivityButton =
                findViewById(R.id.profile_image_button_finish);
        String photoUrl = MainActivity.photoUrlPublic;
        Glide.with(this).load(photoUrl).into(profileActivityButton);
        profileActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent profileIntent =
                        new Intent(FinishActivity.this,
                                   ProfileActivity.class);
                startActivity(profileIntent);
            }
        });
//        ActivityFinishBinding binding =
//                ActivityFinishBinding.inflate(getLayoutInflater());
//        setContentView(binding.getRoot());

        // Obtain the SupportMapFragment and get notified when the map is
        // ready to be used.
        SupportMapFragment mapFragment =
                (SupportMapFragment) getSupportFragmentManager()
                        .findFragmentById(R.id.finish_map);
        mapFragment.getMapAsync(this);
    }
    @Override
    public void onMapReady(GoogleMap googleMap) {
        if (ActivityCompat.checkSelfPermission(this,
                                               android.Manifest.permission.ACCESS_FINE_LOCATION) !=
                PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this,
                                                   android.Manifest.permission.ACCESS_COARSE_LOCATION) !=
                        PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode,
            //   String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See
            // the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        googleMap.setMyLocationEnabled(true);
        LocationManager locationManager =
                (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        // Zoom in on the user's current location
        Location lastLocation = locationManager.getLastKnownLocation(
                LocationManager.GPS_PROVIDER);
        if (lastLocation != null) {
            LatLng userLocation = new LatLng(lastLocation.getLatitude(),
                                             lastLocation.getLongitude());
            Log.d(TAG, "User location: " + userLocation);
            googleMap.moveCamera(
                    CameraUpdateFactory.newLatLngZoom(userLocation, 15));
        }
        path = getIntent().getParcelableArrayListExtra("path");
        PolygonOptions polygonOptions = new PolygonOptions()
                .addAll(path)
                .strokeColor(Color.argb(128, 255, 0, 0))
                .fillColor(Color.argb(128, 255, 0, 0))
                .strokeWidth(5)
                .geodesic(true);
        googleMap.addPolygon(polygonOptions);
        distanceRan = getIntent().getDoubleExtra("distanceRan", 0.0);
        areaRan = getIntent().getDoubleExtra("areaRan", 0.0);
        Log.d(TAG, "Area: " + areaRan);
        Log.d(TAG, "Dist: " + distanceRan);
        String statsText = "You ran an area of " + areaRan + " km² and a distance of " + distanceRan + " km!";
        TextView textStats = findViewById(R.id.text_stats);
        textStats.setText(statsText);
    }
}