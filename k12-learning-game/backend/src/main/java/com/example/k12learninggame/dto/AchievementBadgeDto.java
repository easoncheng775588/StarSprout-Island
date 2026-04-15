package com.example.k12learninggame.dto;

public record AchievementBadgeDto(
        String code,
        String title,
        String description,
        String progressText,
        boolean unlocked
) {
}
