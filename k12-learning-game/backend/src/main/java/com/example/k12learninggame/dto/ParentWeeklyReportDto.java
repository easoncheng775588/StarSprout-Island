package com.example.k12learninggame.dto;

import java.util.List;

public record ParentWeeklyReportDto(
        String title,
        String dateRangeLabel,
        String summary,
        String highlightText,
        String growthFocus,
        String parentAction,
        int completedLevels,
        int studyMinutes,
        int earnedStars,
        int averageAccuracyPercent,
        int effectiveLearningDays,
        List<String> subjectHighlights
) {
}
