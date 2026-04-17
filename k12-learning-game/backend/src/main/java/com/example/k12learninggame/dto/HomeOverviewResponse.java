package com.example.k12learninggame.dto;

import java.util.List;

public record HomeOverviewResponse(
        ChildProfileDto child,
        List<SubjectCardDto> subjects,
        AchievementPreviewDto achievementPreview,
        String featuredWorld,
        String todayTask,
        String nextLevelCode,
        String nextLevelTitle
) {
}
