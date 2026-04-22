package com.example.k12learninggame.dto;

public record ParentWeakPointActionDto(
        String subjectTitle,
        String knowledgePointTitle,
        String priorityLabel,
        String focusReason,
        String parentGuidance,
        String practicePlan,
        String targetLevelCode
) {
}
