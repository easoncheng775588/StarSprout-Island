package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "leaderboard_entries")
public class LeaderboardEntryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private LeaderboardBucketType bucketType;

    private int rankNumber;

    private String nickname;

    private int stars;

    private String trendLabel;

    private int displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_type", nullable = false)
    private LeaderboardBoardEntity board;

    protected LeaderboardEntryEntity() {
    }

    public LeaderboardBucketType getBucketType() {
        return bucketType;
    }

    public int getRankNumber() {
        return rankNumber;
    }

    public String getNickname() {
        return nickname;
    }

    public int getStars() {
        return stars;
    }

    public String getTrendLabel() {
        return trendLabel;
    }
}
