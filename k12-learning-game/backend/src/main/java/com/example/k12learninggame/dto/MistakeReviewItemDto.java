package com.example.k12learninggame.dto;

public record MistakeReviewItemDto(
        String knowledgePointCode,
        String levelTitle,
        String knowledgePointTitle,
        int mistakeCount,
        String reviewAction,
        String targetLevelCode
) {
}
