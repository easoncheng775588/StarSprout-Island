package com.example.k12learninggame.dto;

public record ParentFluencyTypeInsightDto(
        String focusArea,
        String focusAreaLabel,
        int attemptCount,
        int averageAccuracyPercent,
        String statusLabel,
        String recommendation
) {
}
