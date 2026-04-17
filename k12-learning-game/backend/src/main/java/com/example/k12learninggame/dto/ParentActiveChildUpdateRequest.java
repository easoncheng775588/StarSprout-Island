package com.example.k12learninggame.dto;

import jakarta.validation.constraints.NotNull;

public record ParentActiveChildUpdateRequest(@NotNull Long childProfileId) {
}
