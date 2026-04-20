package com.example.k12learninggame.dto;

public record DailyTaskDto(
        String code,
        String title,
        String description,
        String taskType,
        boolean completed,
        String statusLabel,
        String targetLevelCode,
        String rewardText,
        boolean rewardClaimed,
        boolean claimable
) {
}
