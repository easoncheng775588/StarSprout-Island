package com.example.k12learninggame.dto;

import java.util.List;

public record AchievementsResponse(
        String childNickname,
        int unlockedCount,
        int totalCount,
        List<AchievementBadgeDto> unlockedBadges,
        List<AchievementBadgeDto> inProgressBadges
) {
}
