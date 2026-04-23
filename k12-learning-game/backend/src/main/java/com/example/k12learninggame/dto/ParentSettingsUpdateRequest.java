package com.example.k12learninggame.dto;

public record ParentSettingsUpdateRequest(
        boolean leaderboardEnabled,
        int dailyStudyMinutes,
        boolean reminderEnabled,
        String practiceIntensity
) {
}
