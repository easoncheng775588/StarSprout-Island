package com.example.k12learninggame.dto;

public record ParentFluencyStageInsightDto(
        String stageLabel,
        int attemptCount,
        int averageAccuracyPercent,
        String statusLabel,
        String recommendation
) {
}
