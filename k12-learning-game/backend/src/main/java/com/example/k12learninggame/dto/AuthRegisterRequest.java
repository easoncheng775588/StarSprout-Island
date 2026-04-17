package com.example.k12learninggame.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthRegisterRequest(
        @NotBlank String displayName,
        @NotBlank String phone,
        @NotBlank String password
) {
}
