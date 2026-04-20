package com.example.k12learninggame.dto;

import java.util.List;

public record DailyTaskBoardResponse(
        String childNickname,
        int completedCount,
        int totalCount,
        int bonusStars,
        List<DailyTaskDto> tasks
) {
}
