package com.example.k12learninggame.dto;

public record LearningVitalsDto(
        int totalCompletedLevels,
        int averageAccuracyPercent,
        String strongestSubjectTitle,
        int averageSessionMinutes,
        String bestLearningPeriodLabel,
        int effectiveLearningDays
) {
}
