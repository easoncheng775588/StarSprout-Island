package com.example.k12learninggame.dto;

public record CompletionLeaderboardFeedbackDto(
        String boardTitle,
        int rankBefore,
        int rankAfter,
        String trendLabel,
        String message,
        int totalStars
) {
}
