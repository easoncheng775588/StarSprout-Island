package com.example.k12learninggame.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record FluencyAttemptRequest(
        @NotBlank String stageLabel,
        @NotBlank String focusArea,
        @Min(1) @Max(50) int totalQuestions,
        @Min(0) @Max(50) int correctCount,
        @Min(1) @Max(600) int durationSeconds
) {
}
