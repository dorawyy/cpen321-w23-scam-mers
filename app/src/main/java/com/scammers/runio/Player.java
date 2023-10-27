package com.scammers.runio;

import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

public class Player {
    public final String playerEmail;
    public final String playerPhotoUrl;
    public final String playerDisplayName;
    public final int[] lobbyIdArray;

    private final int MAX_LOBBYS = 10;


    public Player(GoogleSignInAccount account) {
        this.playerEmail = account.getEmail();
        this.playerPhotoUrl = String.valueOf(account.getPhotoUrl());
        this.playerDisplayName = account.getDisplayName();
        this.lobbyIdArray = new int[MAX_LOBBYS];

        // TODO: Assign unique ID to each Player created
    }
    public Player(String playerEmail, String playerDisplayName, String playerPhotoUrl) {
        this.playerEmail = playerEmail;
        this.playerPhotoUrl = playerPhotoUrl;
        this.playerDisplayName = playerDisplayName;
        this.lobbyIdArray = new int[MAX_LOBBYS];

        // TODO: Assign unique ID to each Player created
    }
}
