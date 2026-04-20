package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_task_claims")
public class DailyTaskClaimEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_profile_id", nullable = false)
    private ChildProfileEntity childProfile;

    private String taskCode;

    private LocalDate taskDate;

    private int rewardStars;

    private LocalDateTime claimedAt;

    protected DailyTaskClaimEntity() {
    }

    public DailyTaskClaimEntity(
            ChildProfileEntity childProfile,
            String taskCode,
            LocalDate taskDate,
            int rewardStars,
            LocalDateTime claimedAt
    ) {
        this.childProfile = childProfile;
        this.taskCode = taskCode;
        this.taskDate = taskDate;
        this.rewardStars = rewardStars;
        this.claimedAt = claimedAt;
    }

    public ChildProfileEntity getChildProfile() {
        return childProfile;
    }

    public String getTaskCode() {
        return taskCode;
    }

    public LocalDate getTaskDate() {
        return taskDate;
    }

    public int getRewardStars() {
        return rewardStars;
    }

    public LocalDateTime getClaimedAt() {
        return claimedAt;
    }
}
