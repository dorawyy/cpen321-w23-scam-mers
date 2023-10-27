package com.scammers.runio;

import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

import java.util.Arrays;
import java.util.HashSet;

public class Player {
    private String playerId = null;
    public final String playerEmail;
    public final String playerPhotoUrl;
    public final String playerDisplayName;
    public HashSet<String> lobbySet;


    // Called when making a new player
    public Player(GoogleSignInAccount account) {
        this.playerEmail = account.getEmail();
        this.playerPhotoUrl = String.valueOf(account.getPhotoUrl());
        this.playerDisplayName = account.getDisplayName();
        this.lobbySet = new HashSet<String>();
    }

    // Called when retrieving an exiting player
    public Player(String playerId, String playerEmail, String playerDisplayName, String playerPhotoUrl) {
        this.playerEmail = playerEmail;
        this.playerPhotoUrl = playerPhotoUrl;
        this.playerDisplayName = playerDisplayName;
        // CHANGE ME OR NOTHING WILL WORK
        this.lobbySet = new HashSet<String>();
        this.playerId = playerId;
    }

    public String getPlayerId() {
        return this.playerId;
    }
}
