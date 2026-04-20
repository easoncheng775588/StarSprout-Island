package com.example.k12learninggame.dto;

public record LearningPathLevelDto(
        String levelCode,
        String levelTitle,
        String status,
        boolean locked,
        String lockReason
) {
}
