package com.example.k12learninggame.dto;

public record AchievementPreviewDto(
        int unlockedCount,
        int totalCount,
        String nextBadgeName
) {
}
