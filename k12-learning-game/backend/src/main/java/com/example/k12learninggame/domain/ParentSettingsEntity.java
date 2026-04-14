package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "parent_settings")
public class ParentSettingsEntity {

    @Id
    private Long childProfileId;

    private boolean leaderboardEnabled;

    private int dailyStudyMinutes;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_profile_id")
    private ChildProfileEntity childProfile;

    protected ParentSettingsEntity() {
    }

    public boolean isLeaderboardEnabled() {
        return leaderboardEnabled;
    }

    public int getDailyStudyMinutes() {
        return dailyStudyMinutes;
    }
}
