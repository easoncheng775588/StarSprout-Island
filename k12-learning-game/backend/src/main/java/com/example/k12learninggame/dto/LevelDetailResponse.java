package com.example.k12learninggame.dto;

import java.util.List;

public record LevelDetailResponse(
        String code,
        String title,
        String subjectTitle,
        String description,
        List<LevelStepDto> steps,
        RewardDto reward
) {
}
