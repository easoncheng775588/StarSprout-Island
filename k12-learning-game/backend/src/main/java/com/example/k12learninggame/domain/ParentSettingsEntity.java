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

    private boolean reminderEnabled;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_profile_id")
    private ChildProfileEntity childProfile;

    protected ParentSettingsEntity() {
    }

    public ParentSettingsEntity(
            ChildProfileEntity childProfile,
            boolean leaderboardEnabled,
            int dailyStudyMinutes,
            boolean reminderEnabled
    ) {
        this.childProfile = childProfile;
        this.childProfileId = childProfile.getId();
        this.leaderboardEnabled = leaderboardEnabled;
        this.dailyStudyMinutes = dailyStudyMinutes;
        this.reminderEnabled = reminderEnabled;
    }

    public boolean isLeaderboardEnabled() {
        return leaderboardEnabled;
    }

    public int getDailyStudyMinutes() {
        return dailyStudyMinutes;
    }

    public boolean isReminderEnabled() {
        return reminderEnabled;
    }

    public void update(boolean leaderboardEnabled, int dailyStudyMinutes, boolean reminderEnabled) {
        this.leaderboardEnabled = leaderboardEnabled;
        this.dailyStudyMinutes = dailyStudyMinutes;
        this.reminderEnabled = reminderEnabled;
    }
}
