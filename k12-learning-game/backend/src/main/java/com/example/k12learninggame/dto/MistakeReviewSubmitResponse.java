package com.example.k12learninggame.dto;

public record MistakeReviewSubmitResponse(
        String levelCode,
        boolean mastered,
        String masteryStatus,
        int remainingMistakes,
        String nextAction,
        MistakeReviewCenterResponse reviewCenter
) {
}
