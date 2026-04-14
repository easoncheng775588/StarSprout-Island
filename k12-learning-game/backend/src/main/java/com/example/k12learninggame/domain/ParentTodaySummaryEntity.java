package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "parent_today_summaries")
public class ParentTodaySummaryEntity {

    @Id
    private Long childProfileId;

    private int completedLevels;

    private int studyMinutes;

    private int earnedStars;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_profile_id")
    private ChildProfileEntity childProfile;

    protected ParentTodaySummaryEntity() {
    }

    public int getCompletedLevels() {
        return completedLevels;
    }

    public int getStudyMinutes() {
        return studyMinutes;
    }

    public int getEarnedStars() {
        return earnedStars;
    }
}
