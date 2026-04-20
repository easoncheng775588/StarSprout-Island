package com.example.k12learninggame.dto;

public record DailyTaskClaimResponse(
        String taskCode,
        boolean claimed,
        boolean alreadyClaimed,
        int rewardStars,
        int totalStars,
        String message,
        DailyTaskBoardResponse taskBoard
) {
}
