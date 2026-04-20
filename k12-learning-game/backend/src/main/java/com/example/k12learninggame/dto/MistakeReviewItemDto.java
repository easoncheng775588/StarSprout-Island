package com.example.k12learninggame.dto;

public record MistakeReviewItemDto(
        String levelTitle,
        String knowledgePointTitle,
        int mistakeCount,
        String reviewAction,
        String targetLevelCode
) {
}
