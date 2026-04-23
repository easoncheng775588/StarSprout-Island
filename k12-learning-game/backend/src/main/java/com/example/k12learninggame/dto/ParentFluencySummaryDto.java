package com.example.k12learninggame.dto;

import java.util.List;

public record ParentFluencySummaryDto(
        int attemptCount,
        int averageAccuracyPercent,
        String latestStageLabel,
        int latestAccuracyPercent,
        String latestRecordedAtLabel,
        String encouragement,
        List<ParentFluencyTrendPointDto> fluencyTrend,
        List<ParentFluencyStageInsightDto> stageInsights
) {
}
