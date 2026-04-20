package com.example.k12learninggame.dto;

public record StageReportDto(
        String stageLabel,
        int completedLevels,
        int totalLevels,
        int completionPercent,
        String readinessLabel,
        String nextMilestone
) {
}
