package com.example.k12learninggame.dto;

import java.util.List;

public record ParentDashboardResponse(
        String childNickname,
        ParentTodaySummaryDto todaySummary,
        List<ParentSubjectProgressDto> subjectProgress,
        List<TrendPointDto> weeklyTrend,
        List<WeakPointDto> weakPoints,
        AchievementSummaryDto achievementSummary,
        GoalProgressDto goalProgress,
        List<String> recommendedActions,
        ParentSettingsDto settings
) {
}
