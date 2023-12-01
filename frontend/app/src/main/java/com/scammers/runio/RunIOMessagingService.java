package com.scammers.runio;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.TaskStackBuilder;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class RunIOMessagingService extends FirebaseMessagingService {
    private final String TAG = "Notification";

    // ChatGPT usage: NO
    public static void updateToken() {
        if (MainActivity.currentPlayer == null ||
                MainActivity.fcmToken == null ||
                MainActivity.client == null) {
            return;
        }
        String fcmUrl = "https://40.90.192.159:8081/player/" +
                MainActivity.currentPlayer.getPlayerId() + "/fcmToken/" +
                MainActivity.fcmToken;
        MediaType mediaType =
                MediaType.parse("application/json; " +
                                        "charset=utf-8");
        RequestBody requestBody =
                RequestBody.create("", mediaType);
        Request updateFcmToken =
                new Request.Builder().url(fcmUrl).put(requestBody).build();

        MainActivity.client.newCall(updateFcmToken).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(@NonNull Call call,
                                   @NonNull Response response)
                    throws IOException {
                if (response.code() != 200) {
                    throw new IOException(
                            "Unable to update FCM Token. Response: " +
                                    response);
                }
            }
        });
    }

    // ChatGPT usage: NO
    @Override
    public void onNewToken(@NonNull String token) {
        Log.d(TAG, "Refreshed token: " + token);
        MainActivity.fcmToken = token;
        updateToken();
    }

    // ChatGPT usage: Partial
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Log.d(TAG,
              "Notification Received: " + remoteMessage.getData());
        String title = remoteMessage.getData().get("title");
        String body = remoteMessage.getData().get("body");

        // Create a unique notification ID (you can use a random number or a
        // unique identifier)
        int notificationId = (int) System.currentTimeMillis();

        // Create an Intent to open the app when the notification is clicked
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

        // Create a TaskStackBuilder to ensure that navigating from the
        // notification opens the correct activity
        TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);
        stackBuilder.addNextIntentWithParentStack(intent);

        // Create the pending intent
        PendingIntent pendingIntent =
                stackBuilder.getPendingIntent(0,
                                      PendingIntent.FLAG_UPDATE_CURRENT |
                                              PendingIntent.FLAG_IMMUTABLE);

        // Create a notification channel (required for Android Oreo and above)
        String channelId = "channel_id";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel =
                    new NotificationChannel(channelId, "Channel Name",
                                    NotificationManager.IMPORTANCE_DEFAULT);
            NotificationManager notificationManager =
                    getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }

        // Build the notification
        NotificationCompat.Builder builder =
                new NotificationCompat.Builder(this, channelId)
                        .setSmallIcon(R.drawable.run_icon)
                        .setContentTitle(title)
                        .setContentText(body)
                        .setContentIntent(pendingIntent)
                        .setAutoCancel(true);

        // Get the NotificationManager
        NotificationManager notificationManager =
                (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        // Show the notification
        notificationManager.notify(notificationId, builder.build());
    }
}
