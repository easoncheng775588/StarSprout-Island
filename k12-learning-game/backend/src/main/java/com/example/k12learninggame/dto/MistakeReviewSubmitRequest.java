package com.example.k12learninggame.dto;

import jakarta.validation.constraints.Min;

public record MistakeReviewSubmitRequest(
        @Min(0) int correctCount,
        @Min(0) int wrongCount,
        @Min(1) int durationSeconds
) {
}
