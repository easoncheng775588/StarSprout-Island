package com.example.k12learninggame.dto;

public record LevelStepDto(
        String id,
        String type,
        String prompt,
        String activityConfigJson,
        String knowledgePointCode,
        String knowledgePointTitle,
        Integer variantCount
) {
}
