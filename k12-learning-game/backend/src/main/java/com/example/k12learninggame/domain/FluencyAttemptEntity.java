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
@Table(name = "fluency_attempts")
public class FluencyAttemptEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_profile_id", nullable = false)
    private ChildProfileEntity childProfile;

    private String stageLabel;

    private String focusArea;

    private int totalQuestions;

    private int correctCount;

    private int durationSeconds;

    private int accuracyPercent;

    private LocalDate attemptDate;

    private LocalDateTime recordedAt;

    protected FluencyAttemptEntity() {
    }

    public FluencyAttemptEntity(
            ChildProfileEntity childProfile,
            String stageLabel,
            String focusArea,
            int totalQuestions,
            int correctCount,
            int durationSeconds,
            int accuracyPercent,
            LocalDate attemptDate,
            LocalDateTime recordedAt
    ) {
        this.childProfile = childProfile;
        this.stageLabel = stageLabel;
        this.focusArea = focusArea;
        this.totalQuestions = totalQuestions;
        this.correctCount = correctCount;
        this.durationSeconds = durationSeconds;
        this.accuracyPercent = accuracyPercent;
        this.attemptDate = attemptDate;
        this.recordedAt = recordedAt;
    }

    public String getStageLabel() {
        return stageLabel;
    }

    public ChildProfileEntity getChildProfile() {
        return childProfile;
    }

    public String getFocusArea() {
        return focusArea;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public int getAccuracyPercent() {
        return accuracyPercent;
    }

    public LocalDate getAttemptDate() {
        return attemptDate;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }
}
