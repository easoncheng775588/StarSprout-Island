package com.example.k12learninggame.dto;

import java.util.List;

public record LearningPathChapterDto(
        String subjectCode,
        String subjectTitle,
        String chapterTitle,
        String chapterSubtitle,
        List<LearningPathLevelDto> levels
) {
}
