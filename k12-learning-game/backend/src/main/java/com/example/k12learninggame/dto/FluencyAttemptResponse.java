package com.example.k12learninggame.dto;

public record FluencyAttemptResponse(
        String stageLabel,
        int totalQuestions,
        int correctCount,
        int durationSeconds,
        int accuracyPercent,
        long todayAttemptCount,
        String encouragement
) {
}
