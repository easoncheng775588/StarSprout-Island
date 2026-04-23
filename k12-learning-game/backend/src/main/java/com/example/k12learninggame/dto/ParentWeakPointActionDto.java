package com.example.k12learninggame.dto;

public record ParentWeakPointActionDto(
        String subjectTitle,
        String knowledgePointCode,
        String knowledgePointTitle,
        String priorityLabel,
        String actionStatusLabel,
        String actionStatusDescription,
        String focusReason,
        String parentGuidance,
        String practicePlan,
        String targetLevelCode
) {
}
