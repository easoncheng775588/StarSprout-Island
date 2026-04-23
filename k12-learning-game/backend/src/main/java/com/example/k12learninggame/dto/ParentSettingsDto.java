package com.example.k12learninggame.dto;

public record ParentSettingsDto(
        boolean leaderboardEnabled,
        int dailyStudyMinutes,
        boolean reminderEnabled,
        String practiceIntensity
) {
}
