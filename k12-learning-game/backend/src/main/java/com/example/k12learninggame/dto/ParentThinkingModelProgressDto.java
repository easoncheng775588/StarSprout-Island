package com.example.k12learninggame.dto;

public record ParentThinkingModelProgressDto(
        String modelCode,
        String modelTitle,
        String modelTypeLabel,
        int completedLevels,
        int totalLevels,
        int progressPercent,
        String nextAction
) {
}
