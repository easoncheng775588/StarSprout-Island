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
@Table(name = "level_completions")
public class LevelCompletionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_profile_id", nullable = false)
    private ChildProfileEntity childProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_code", nullable = false)
    private LevelEntity level;

    private int correctCount;

    private int wrongCount;

    private int durationSeconds;

    private String resultMessage;

    private LocalDateTime completedAt;

    protected LevelCompletionEntity() {
    }

    public LevelCompletionEntity(
            ChildProfileEntity childProfile,
            LevelEntity level,
            int correctCount,
            int wrongCount,
            int durationSeconds,
            String resultMessage,
            LocalDateTime completedAt
    ) {
        this.childProfile = childProfile;
        this.level = level;
        this.correctCount = correctCount;
        this.wrongCount = wrongCount;
        this.durationSeconds = durationSeconds;
        this.resultMessage = resultMessage;
        this.completedAt = completedAt;
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

    public int getWrongCount() {
        return wrongCount;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public String getResultMessage() {
        return resultMessage;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}
