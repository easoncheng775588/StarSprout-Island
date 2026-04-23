package com.example.k12learninggame.dto;

import java.util.List;

public record FluencyPracticeResponse(
        String stageLabel,
        String focusArea,
        String focusAreaLabel,
        List<FluencyPracticeQuestionDto> questions
) {
}
