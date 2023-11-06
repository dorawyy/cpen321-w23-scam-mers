package com.scammers.runio;

import static com.scammers.runio.MainActivity.client;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.DecimalFormat;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Request;
import okhttp3.Response;


public class ProfileActivity extends AppCompatActivity {

    private ImageButton homeActivityButton;

    private ImageView profilePictureView;

    private TextView totalArea;
    
    private TextView totalDistance;

    // ChatGPT usage: NO
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        homeActivityButton = findViewById(R.id.home_button_profile);
        homeActivityButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Go to new activity page where activity is live
                Intent runningIntent =
                        new Intent(ProfileActivity.this,
                                   HomeActivity.class);
                startActivity(runningIntent);
            }
        });

        profilePictureView = findViewById(R.id.profile_picture_view);
        String photoUrl = MainActivity.photoUrlPublic;
        Glide.with(this).load(photoUrl).into(profilePictureView);

        totalArea = findViewById(R.id.profile_area_text);
        totalDistance = findViewById(R.id.profile_distance_text);

        // GET request to check if player exists
        String url = "https://40.90.192.159:8081/player/" +
                MainActivity.currentPlayer.playerEmail;
        Request checkPlayer = new Request.Builder().url(url).build();
        client.newCall(checkPlayer).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(@NonNull Call call,
                                   @NonNull Response response)
                    throws IOException {
                String responseBody = response.body().string();
                try {
                    JSONObject playerJSON = new JSONObject(responseBody);
                    double totalAreaRanDouble = Double.valueOf(
                            playerJSON.getString("totalAreaRan"));
                    double totalDistanceRanDouble = Double.valueOf(
                            playerJSON.getString("totalDistanceRan"));
                    DecimalFormat df = new DecimalFormat("0.00");
                    String totalAreaRan = df.format(totalAreaRanDouble);
                    String totalDistanceRan = df.format(totalDistanceRanDouble);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            totalArea.setText(
                                    "Total Area Claimed: " + totalAreaRan +
                                            "km²");
                            totalDistance.setText(
                                    "Total Distance Ran: " + totalDistanceRan +
                                            "km");
                        }
                    });
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
            }
        });

    }
}