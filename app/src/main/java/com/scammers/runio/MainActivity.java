package com.scammers.runio;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.util.HashSet;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class MainActivity extends AppCompatActivity {

    final static String TAG = "MainActivity";
    private Button locationButton;
    private GoogleSignInClient mGoogleSignInClient;

    public static String photoUrlPublic;

    public static OkHttpClient client;
    public static Player currentPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        locationButton = findViewById(R.id.location_button);
        locationButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkPermissions();
                Log.d(TAG, "Trying to request location permission");
                Toast.makeText(MainActivity.this, "Trying to request location permissions", Toast.LENGTH_LONG).show();
            }
        });

        // Configure sign-in to request the user's ID, email address, and basic
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken("749392990960-mlcvsjnsc9l7n46i8ppqhmbm86auosoh.apps.googleusercontent.com")
                .requestEmail()
                .build();
        // Build a GoogleSignInClient with the options specified by gso.
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        findViewById(R.id.sign_in_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                signIn();
            }
        });
    }

    private void signIn() {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        signInLauncher.launch(signInIntent);
    }

    private ActivityResultLauncher<Intent> signInLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == Activity.RESULT_OK) {
                    // Handle the successful sign-in here
                    // You can get the data from the result intent if needed
                    Intent data = result.getData();
                    // Add your logic here
                    Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
                    handleSignInResult(task);
                } else {
                    Log.d(TAG, "Problem Signing In");
                    // Handle the unsuccessful sign-in here
                    // Add your logic for handling the failure
                }
            }
    );

    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);
//            String idToken = account.getIdToken();
//            // TODO(developer): send ID Token to server and validate
            // Signed in successfully, show authenticated UI.
            updateUI(account);
        } catch (ApiException e) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w(TAG, "signInResult:failed code=" + e.getStatusCode());
            updateUI(null);
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        // Check for existing Google Sign In account, if the user is already signed in
        // the GoogleSignInAccount will be non-null.
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);
        updateUI(account);
    }

    private void updateUI(GoogleSignInAccount account) {
        if (account == null) {
            Log.d(TAG, "There is no user signed in");
        } else {
            String photoUrl = String.valueOf(account.getPhotoUrl());
            Log.d(TAG, "Name: " + account.getDisplayName());
            Log.d(TAG, "Email: " + account.getEmail());
            Log.d(TAG, "Family Name: " + account.getFamilyName());
            Log.d(TAG, "Given Name: " + account.getGivenName());
            Log.d(TAG, "Photo URL: " + photoUrl);

            // Send photoUrl to other activities
            photoUrlPublic = photoUrl;

            // setup client for HTTP and trusting backend server certificate
            setupHttpClient();

            // GET request to check if player exists
            String url = "https://40.90.192.159:8081/player/" + account.getEmail();
            Request checkPlayer = new Request.Builder().url(url).build();
            client.newCall(checkPlayer).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    e.printStackTrace();
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    String responseBody = response.body().string();
//                    Log.d(TAG, "response:" + response);
//                    Log.d(TAG, "response.body():" + response.body());

                    if (response.code() == 404) {
                        Log.d(TAG, "HEEHEHREEE");
                        currentPlayer = new Player(account);
                        // PUT to backend
                        MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
                        RequestBody requestBody = null;
                        try {
                            requestBody = RequestBody.create(currentPlayer.toJSON(), mediaType);
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
//                        Log.d(TAG, "request bodyyyy" + requestBody.toString());
                        Request request = new Request.Builder()
                                .url(url)
                                .put(requestBody) // Use PUT method
                                .build();
//                        Log.d(TAG, "after bulding" + request.body());
                        client.newCall(request).enqueue(new Callback() {
                            @Override
                            public void onFailure(Call call, IOException e) {
                                e.printStackTrace();
                            }

                            @Override
                            public void onResponse(Call call, Response response) throws IOException {
                                if (response.isSuccessful()) {
                                    // Handle the successful response here
                                    try {
                                        currentPlayer.setPlayerId(new JSONObject(response.body().string()).getString("_id"));
                                    } catch (JSONException e) {
                                        throw new RuntimeException(e);
                                    }
                                    Log.d(TAG, "putting message" + response);
                                } else {
                                    // Handle the error response here
                                    Log.d(TAG, "error putting message" + response);
                                }
                            }
                        });
                    } else if (response.code() == 200) {
                        try {
                            JSONObject body = new JSONObject(responseBody);
                            Log.d(TAG, "Lobbyset from DB: " + body.getJSONArray("lobbySet"));
                            currentPlayer = new Player(body);
                            Log.d(TAG, "Player Class:" + currentPlayer.playerEmail + currentPlayer.playerPhotoUrl + currentPlayer.playerDisplayName + " lobbySet: " + currentPlayer.lobbySet + "distance:" + currentPlayer.totalDistanceRan + "area:" + currentPlayer.totalAreaRan);
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                    } else {
                        throw new IOException("Unexpected code " + response);
                    }
//                        runOnUiThread(() -> {
//                            TextView myName = findViewById(R.id.my_name);
//                            myName.setText("My Name: " + responseBody);
//                        });
                }

            });

            // Send token to backend
            // Move to another activity
            Intent homeIntent = new Intent(MainActivity.this, HomeActivity.class);
            startActivity(homeIntent);
        }
    }

    private void checkPermissions() {
        if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
                && ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "We got location thanks!", Toast.LENGTH_LONG).show();
            return;
        } else {
            if (ActivityCompat.shouldShowRequestPermissionRationale(this, android.Manifest.permission.ACCESS_COARSE_LOCATION)
                    || ActivityCompat.shouldShowRequestPermissionRationale(this, android.Manifest.permission.ACCESS_FINE_LOCATION)) {
                new AlertDialog.Builder(this)
                        .setTitle("Need Location Permissions")
                        .setMessage("We need location permissions to mark your location on map")
                        .setNegativeButton("CANCEL", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                Toast.makeText(MainActivity.this, "We need location permissions to run", Toast.LENGTH_LONG).show();
                                dialogInterface.dismiss();
                            }
                        })
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                ActivityCompat.requestPermissions(MainActivity.this, new String[]{android.Manifest.permission.ACCESS_COARSE_LOCATION, android.Manifest.permission.ACCESS_FINE_LOCATION}, 1);
                            }
                        })
                        .create()
                        .show();
            } else {
                ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            }
        }
    }

    private void setupHttpClient() {
        // Load your self-signed certificate or CA certificate from a resource
        InputStream certInputStream = getResources().openRawResource(R.raw.cert);

        try {
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            Certificate ca;
            ca = cf.generateCertificate(certInputStream);

            // Create a KeyStore containing your certificate
            KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            keyStore.load(null, null);
            keyStore.setCertificateEntry("ca", ca);

            // Create a TrustManager that trusts the CAs in your KeyStore
            TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            trustManagerFactory.init(keyStore);

            // Create an SSLContext with the custom TrustManager
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustManagerFactory.getTrustManagers(), null);

            // Set up your OkHttpClient to use the custom SSLContext
            client = new OkHttpClient.Builder()
                    .sslSocketFactory(sslContext.getSocketFactory(), (X509TrustManager) trustManagerFactory.getTrustManagers()[0])
                    .hostnameVerifier((hostname, session) -> true) // Bypass hostname verification if needed
                    .build();

            // Use this client for your network requests
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}