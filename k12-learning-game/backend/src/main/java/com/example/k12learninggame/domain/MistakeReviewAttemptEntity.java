package com.example.k12learninggame.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "mistake_review_attempts")
public class MistakeReviewAttemptEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_profile_id", nullable = false)
    private ChildProfileEntity childProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_code", nullable = false)
    private LevelEntity level;

    private String knowledgePointCode;

    private int correctCount;

    private int wrongCount;

    private int durationSeconds;

    private boolean mastered;

    private String masteryStatus;

    private LocalDateTime reviewedAt;

    protected MistakeReviewAttemptEntity() {
    }

    public MistakeReviewAttemptEntity(
            ChildProfileEntity childProfile,
            LevelEntity level,
            String knowledgePointCode,
            int correctCount,
            int wrongCount,
            int durationSeconds,
            boolean mastered,
            String masteryStatus,
            LocalDateTime reviewedAt
    ) {
        this.childProfile = childProfile;
        this.level = level;
        this.knowledgePointCode = knowledgePointCode;
        this.correctCount = correctCount;
        this.wrongCount = wrongCount;
        this.durationSeconds = durationSeconds;
        this.mastered = mastered;
        this.masteryStatus = masteryStatus;
        this.reviewedAt = reviewedAt;
    }

    public ChildProfileEntity getChildProfile() {
        return childProfile;
    }

    public LevelEntity getLevel() {
        return level;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public String getKnowledgePointCode() {
        return knowledgePointCode;
    }

    public int getWrongCount() {
        return wrongCount;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public boolean isMastered() {
        return mastered;
    }

    public String getMasteryStatus() {
        return masteryStatus;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }
}
