package com.scammers.runio;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.PopupWindow;

public class LobbiesActivity extends AppCompatActivity {

    private ImageButton homeActivityButton;
    private Button createLobbyButton;

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

        createLobbyButton = findViewById(R.id.create_lobby_button);
        createLobbyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                // Display lobby creator as popup
//                LayoutInflater inflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);
//                View popupView = inflater.inflate(R.layout.activity_new_lobby, null);
//
//                int width = LinearLayout.LayoutParams.WRAP_CONTENT;
//                int height = LinearLayout.LayoutParams.WRAP_CONTENT;
//                final PopupWindow createLobbyPopup = new PopupWindow(popupView, width, height, true);
//
//                createLobbyPopup.showAtLocation(view, Gravity.CENTER, 0, 0);
//
//                popupView.setOnTouchListener(new View.OnTouchListener() {
//                    @Override
//                    public boolean onTouch(View view, MotionEvent motionEvent) {
//                        createLobbyPopup.dismiss();
//                        return true;
//                    }
//                });
                Intent newLobbyIntent = new Intent(LobbiesActivity.this, NewLobbyActivity.class);
                startActivity(newLobbyIntent);
            }
        });
    }
}