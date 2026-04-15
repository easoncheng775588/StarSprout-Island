package com.example.k12learninggame.dto;

public record GoalProgressDto(
        int goalMinutes,
        int completedMinutes,
        int completionPercent
) {
}
