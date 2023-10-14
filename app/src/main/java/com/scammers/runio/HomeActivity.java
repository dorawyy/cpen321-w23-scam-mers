package com.scammers.runio;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class HomeActivity extends AppCompatActivity {

    private Button startActivityButton;

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
    }
}