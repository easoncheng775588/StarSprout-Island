package com.example.k12learninggame.dto;

public record KnowledgeMapItemDto(
        String subjectTitle,
        String knowledgePointCode,
        String knowledgePointTitle,
        int masteryPercent,
        String statusLabel,
        String nextAction
) {
}
