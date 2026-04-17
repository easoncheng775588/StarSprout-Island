package com.example.k12learninggame.dto;

import jakarta.validation.constraints.NotBlank;

public record ChildProfileUpsertRequest(
        @NotBlank String nickname,
        @NotBlank String title,
        @NotBlank String stageLabel,
        @NotBlank String avatarColor
) {
}
