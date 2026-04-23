package com.example.k12learninggame.dto;

import java.util.List;

public record LearningPathChapterDto(
        String subjectCode,
        String subjectTitle,
        String chapterTitle,
        String chapterSubtitle,
        String unitGoal,
        int completedLevelCount,
        int totalLevelCount,
        int completionPercent,
        String checkpointStatus,
        String checkpointLevelCode,
        String checkpointCtaText,
        List<LearningPathLevelDto> levels
) {
}
