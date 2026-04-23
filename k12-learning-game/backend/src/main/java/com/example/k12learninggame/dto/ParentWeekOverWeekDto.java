package com.example.k12learninggame.dto;

public record ParentWeekOverWeekDto(
        int studyMinutesDelta,
        int completedLevelsDelta,
        int accuracyDelta,
        int fluencyAttemptDelta,
        String summary
) {
}
