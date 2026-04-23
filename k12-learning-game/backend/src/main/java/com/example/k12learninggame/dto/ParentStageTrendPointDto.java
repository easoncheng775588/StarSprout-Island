package com.example.k12learninggame.dto;

public record ParentStageTrendPointDto(
        String weekLabel,
        int studyMinutes,
        int completedLevels,
        int averageAccuracyPercent,
        int fluencyAttemptCount
) {
}
