package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "leaderboard_boards")
public class LeaderboardBoardEntity {

    @Id
    private String boardType;

    private String privacyTip;

    @OneToMany(mappedBy = "board")
    @OrderBy("displayOrder asc")
    private List<LeaderboardEntryEntity> entries = new ArrayList<>();

    protected LeaderboardBoardEntity() {
    }

    public String getBoardType() {
        return boardType;
    }

    public String getPrivacyTip() {
        return privacyTip;
    }

    public List<LeaderboardEntryEntity> getEntries() {
        return entries;
    }
}
