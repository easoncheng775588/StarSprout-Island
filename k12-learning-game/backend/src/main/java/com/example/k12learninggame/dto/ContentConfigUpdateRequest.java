package com.example.k12learninggame.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ContentConfigUpdateRequest(
        @NotBlank String knowledgePointCode,
        @NotBlank String knowledgePointTitle,
        @Min(1) int variantCount,
        @NotBlank String activityConfigJson
) {
}
