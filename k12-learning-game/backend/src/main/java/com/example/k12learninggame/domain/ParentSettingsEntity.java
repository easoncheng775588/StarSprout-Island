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

    private String practiceIntensity;

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
            boolean reminderEnabled,
            String practiceIntensity
    ) {
        this.childProfile = childProfile;
        this.childProfileId = childProfile.getId();
        this.leaderboardEnabled = leaderboardEnabled;
        this.dailyStudyMinutes = dailyStudyMinutes;
        this.reminderEnabled = reminderEnabled;
        this.practiceIntensity = practiceIntensity;
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

    public String getPracticeIntensity() {
        return practiceIntensity;
    }

    public void update(boolean leaderboardEnabled, int dailyStudyMinutes, boolean reminderEnabled, String practiceIntensity) {
        this.leaderboardEnabled = leaderboardEnabled;
        this.dailyStudyMinutes = dailyStudyMinutes;
        this.reminderEnabled = reminderEnabled;
        this.practiceIntensity = practiceIntensity;
    }
}
