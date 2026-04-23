package com.example.k12learninggame.dto;

import java.math.BigDecimal;
import java.util.List;

public record FluencyPracticeQuestionDto(
        String prompt,
        List<BigDecimal> choices,
        BigDecimal answer
) {
}
