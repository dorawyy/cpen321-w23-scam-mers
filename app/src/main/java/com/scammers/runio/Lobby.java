package com.scammers.runio;

import java.util.ArrayList;
import java.util.List;

public class Lobby {
    private final String lobbyName;
    private final Player lobbyLeader;
    private List<Integer> playerList;

    public Lobby(String lobbyName, Player lobbyLeader) {
        this.lobbyName = lobbyName;
        this.lobbyLeader = lobbyLeader;
        playerList = new ArrayList<Integer>();

        // TODO: Assign unique ID to each Lobby created

        // Add lobbyLeader ID to playerList
//        playerList.add(lobbyLeader.playerId);

        // TODO: Create lobby in db, with lobbyLeader as starting player
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
