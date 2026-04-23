package com.example.k12learninggame.dto;

public record ParentFluencySummaryDto(
        int attemptCount,
        int averageAccuracyPercent,
        String latestStageLabel,
        int latestAccuracyPercent,
        String latestRecordedAtLabel,
        String encouragement
) {
}
