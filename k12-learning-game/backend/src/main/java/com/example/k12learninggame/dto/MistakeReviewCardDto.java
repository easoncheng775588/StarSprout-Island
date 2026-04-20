package com.example.k12learninggame.dto;

import java.util.List;

public record MistakeReviewCardDto(
        String levelCode,
        String levelTitle,
        String subjectTitle,
        String knowledgePointTitle,
        int mistakeCount,
        String masteryStatus,
        String reviewPrompt,
        List<String> reviewSteps
) {
}
