package com.example.k12learninggame.dto;

public record ParentFluencyTrendPointDto(
        String dayLabel,
        int attemptCount,
        int averageAccuracyPercent
) {
}
