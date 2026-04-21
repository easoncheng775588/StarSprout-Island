package com.example.k12learninggame.dto;

public record ParentChildComparisonDto(
        String childNickname,
        String stageLabel,
        int completedLevels,
        int weeklyStars,
        int averageAccuracyPercent,
        boolean activeChild,
        String statusLabel
) {
}
