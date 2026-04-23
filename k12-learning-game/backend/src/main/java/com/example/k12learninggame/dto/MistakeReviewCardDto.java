package com.example.k12learninggame.dto;

import java.util.List;

public record MistakeReviewCardDto(
        String knowledgePointCode,
        String levelCode,
        String levelTitle,
        String subjectTitle,
        String knowledgePointTitle,
        int mistakeCount,
        String masteryStatus,
        String reviewPrompt,
        String targetLevelCode,
        List<String> reviewSteps
) {
}
