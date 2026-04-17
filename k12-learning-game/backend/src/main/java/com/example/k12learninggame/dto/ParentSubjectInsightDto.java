package com.example.k12learninggame.dto;

public record ParentSubjectInsightDto(
        String subjectCode,
        String subjectTitle,
        int completedLevels,
        int totalLevels,
        int accuracyPercent,
        int studyMinutes,
        String nextLevelTitle,
        String nextLevelReason
) {
}
