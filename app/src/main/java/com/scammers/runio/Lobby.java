package com.scammers.runio;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class Lobby {
    public final String lobbyName;
    public final String lobbyLeaderId;
    public HashSet<String> playerSet;

    public Lobby(String lobbyName, String lobbyLeaderId) {
        this.lobbyName = lobbyName;
        this.lobbyLeaderId = lobbyLeaderId;
        this.playerSet = new HashSet<String>();
        this.playerSet.add(lobbyLeaderId);
    }

    // Deletes this lobby from db. Called when all players have left a lobby.
    public void deleteLobby() {

    }

    public void addPlayer(Player newPlayer) {
        // Push newPlayer to playerList
//        playerList.add(newPlayer.playerId);

        // Add newPlayer to lobby in db
    }

    public void removePlayer(Player removedPlayer) {
        // Remove removedPlayer from playerList
//        playerList.remove(removedPlayer.playerId);

        // Remove removedPlayer from lobby in db
    }
}
