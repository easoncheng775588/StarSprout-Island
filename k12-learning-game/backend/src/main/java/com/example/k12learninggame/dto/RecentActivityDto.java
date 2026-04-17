package com.example.k12learninggame.dto;

public record RecentActivityDto(
        String subjectTitle,
        String levelTitle,
        String completedAtLabel,
        int earnedStars
) {
}
