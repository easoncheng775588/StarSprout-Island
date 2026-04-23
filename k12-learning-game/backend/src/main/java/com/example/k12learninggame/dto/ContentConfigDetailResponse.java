package com.example.k12learninggame.dto;

import java.util.List;

public record ContentConfigDetailResponse(
        String levelCode,
        String levelTitle,
        String subjectTitle,
        String stepCode,
        String stepPrompt,
        String knowledgePointCode,
        String knowledgePointTitle,
        int variantCount,
        String activityConfigJson,
        String assetTheme,
        String audioQuality,
        String configSource,
        String healthStatus,
        List<String> healthNotes
) {
}
