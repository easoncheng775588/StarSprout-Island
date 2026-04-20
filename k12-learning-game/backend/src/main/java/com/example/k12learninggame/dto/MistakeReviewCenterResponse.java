package com.example.k12learninggame.dto;

import java.util.List;

public record MistakeReviewCenterResponse(
        String childNickname,
        int totalMistakes,
        int readyToMasterCount,
        List<MistakeReviewCardDto> items
) {
}
