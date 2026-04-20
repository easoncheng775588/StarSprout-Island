package com.example.k12learninggame.dto;

import java.util.List;

public record LearningPathResponse(
        String stageLabel,
        int completedLevels,
        int totalLevels,
        List<LearningPathChapterDto> chapters
) {
}
