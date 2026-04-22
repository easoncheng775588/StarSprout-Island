package com.example.k12learninggame.dto;

import java.util.List;

public record ContentConfigItemDto(
        String levelCode,
        String levelTitle,
        String subjectTitle,
        String knowledgePointCode,
        String knowledgePointTitle,
        int variantCount,
        String assetTheme,
        String audioQuality,
        String configSource,
        String healthStatus,
        List<String> healthNotes
) {
}
