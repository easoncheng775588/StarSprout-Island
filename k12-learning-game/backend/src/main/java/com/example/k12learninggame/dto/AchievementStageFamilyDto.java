package com.example.k12learninggame.dto;

import java.util.List;

public record AchievementStageFamilyDto(
        String stageLabel,
        String title,
        String description,
        int unlockedCount,
        int totalCount,
        int progressPercent,
        List<AchievementBadgeDto> badges
) {
}
