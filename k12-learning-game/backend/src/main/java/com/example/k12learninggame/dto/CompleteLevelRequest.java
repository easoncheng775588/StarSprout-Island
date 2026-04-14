package com.example.k12learninggame.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CompleteLevelRequest(
        @NotNull Long childProfileId,
        @Min(0) int correctCount,
        @Min(0) int wrongCount,
        @Min(0) int durationSeconds
) {
}
