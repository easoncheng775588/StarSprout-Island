package com.example.k12learninggame.dto;

import java.util.List;

public record ParentDashboardResponse(
        String childNickname,
        ParentTodaySummaryDto todaySummary,
        ParentWeeklyReportDto weeklyReport,
        List<ParentSubjectProgressDto> subjectProgress,
        List<TrendPointDto> weeklyTrend,
        List<WeakPointDto> weakPoints,
        List<ParentWeakPointActionDto> weakPointActionPlan,
        AchievementSummaryDto achievementSummary,
        GoalProgressDto goalProgress,
        List<RecommendedActionDto> recommendedActions,
        ParentSettingsDto settings,
        LearningVitalsDto learningVitals,
        ParentFluencySummaryDto fluencySummary,
        List<ParentSubjectInsightDto> subjectInsights,
        List<RecentActivityDto> recentActivities,
        List<ParentChildComparisonDto> siblingComparisons,
        StageReportDto stageReport,
        java.util.List<ParentStageTrendPointDto> stageTrend,
        ParentWeekOverWeekDto weekOverWeek,
        List<KnowledgeMapItemDto> knowledgeMap,
        List<ParentThinkingModelProgressDto> thinkingModelProgress,
        List<MistakeReviewItemDto> mistakeReviewPlan
) {
}
