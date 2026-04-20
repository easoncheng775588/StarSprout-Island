package com.example.k12learninggame.dto;

import java.util.List;

public record CompleteLevelResponse(
        String levelCode,
        RewardDto reward,
        String message,
        boolean isFirstCompletion,
        int effectiveStars,
        int totalStars,
        List<AchievementBadgeDto> newlyUnlockedBadges,
        CompletionLeaderboardFeedbackDto leaderboardFeedback
) {
}
