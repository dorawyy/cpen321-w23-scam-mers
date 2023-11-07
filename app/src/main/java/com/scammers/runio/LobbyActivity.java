package com.scammers.runio;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.bumptech.glide.Glide;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Polygon;
import com.google.android.gms.maps.model.PolygonOptions;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Request;
import okhttp3.Response;

public class LobbyActivity extends AppCompatActivity
        implements OnMapReadyCallback {

    final static String TAG = "LobbyActivity";

    private Lobby currentLobby;

    // ChatGPT usage: NO
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lobby);

        // Obtain the SupportMapFragment and get notified when the map is
        // ready to be used.
        SupportMapFragment mapFragment =
                (SupportMapFragment) getSupportFragmentManager()
                        .findFragmentById(R.id.lobby_map);
        mapFragment.getMapAsync(this);

        ImageButton homeActivityButton = findViewById(R.id.home_button_lobby);
        homeActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent runningIntent =
                        new Intent(LobbyActivity.this,
                                   HomeActivity.class);
                startActivity(runningIntent);
            }
        });

        ImageButton profileActivityButton =
                findViewById(R.id.profile_image_button_lobby);
        String photoUrl = MainActivity.photoUrlPublic;
        Glide.with(this).load(photoUrl).into(profileActivityButton);
        profileActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent profileIntent =
                        new Intent(LobbyActivity.this,
                                   ProfileActivity.class);
                startActivity(profileIntent);
            }
        });

        // Retrieve the lobby ID from the intent's extras
        String lobbyId = getIntent().getStringExtra("lobbyId");

        Button lobby_stats_button = findViewById(R.id.lobby_stats_button);
        lobby_stats_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new lobby stats intent
                Intent lobbyStatsIntent =
                        new Intent(LobbyActivity.this,
                                                     LobbyStatsActivity.class);
                lobbyStatsIntent.putExtra("lobbyStatsId", lobbyId);
                startActivity(lobbyStatsIntent);
            }
        });

        // GET request to get Lobby info
        String url = "https://40.90.192.159:8081/lobby/" + lobbyId;
        Request getLobby = new Request.Builder()
                .url(url)
                .build();
        MainActivity.client.newCall(getLobby).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(@NonNull Call call,
                                   @NonNull Response response)
                    throws IOException {
                if (response.code() != 200) {
                    throw new IOException("Unexpected code " + response);
                }
                try {
                    currentLobby =
                            new Lobby(new JSONObject(response.body().string()));
                    TextView textView = findViewById(
                            R.id.lobby_name); // Replace with the ID of your
                    // TextView
                    textView.setText(
                            currentLobby.lobbyName); // The text you want to set
                } catch (JSONException e) {
                    throw new IOException(e);
                }
            }
        });
    }

    // ChatGPT usage: NO
    @Override
    public void onMapReady(@NonNull GoogleMap googleMap) {
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
        LocationManager locationManager =
                (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        // Zoom in on the user's current location
        Location lastLocation = locationManager.getLastKnownLocation(
                LocationManager.GPS_PROVIDER);
        if (lastLocation != null) {
            LatLng userLocation = new LatLng(lastLocation.getLatitude(),
                                             lastLocation.getLongitude());
            googleMap.moveCamera(
                    CameraUpdateFactory.newLatLngZoom(userLocation, 13));
        }

        // Add polygons to indicate areas on the map.
        for (String key : currentLobby.playerMap.keySet()) {
            PlayerLobbyStats playerLobbyStats = currentLobby.playerMap.get(key);
            assert playerLobbyStats != null;
            for (ArrayList<LatLng> land : playerLobbyStats.lands) {
                Log.d(TAG, land.toString());
                PolygonOptions polygonOptions = new PolygonOptions()
                        .addAll(land)
                        .strokeColor(playerLobbyStats.color)
                        .strokeWidth(5)
                        .fillColor(PlayerLobbyStats.lowerAlpha(
                                playerLobbyStats.color))
                        .geodesic(true);
                googleMap.addPolygon(polygonOptions);
            }
        }
    }
}