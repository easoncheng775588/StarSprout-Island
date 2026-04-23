package com.example.k12learninggame.dto;

import java.util.List;

public record AchievementsResponse(
        String childNickname,
        int unlockedCount,
        int totalCount,
        String currentStageLabel,
        List<AchievementStageFamilyDto> stageFamilies,
        List<AchievementBadgeDto> modelBadges,
        List<AchievementBadgeDto> unlockedBadges,
        List<AchievementBadgeDto> inProgressBadges
) {
}
