package com.example.k12learninggame.dto;

import java.util.List;

public record LeaderboardResponse(
        String boardType,
        LeaderboardRankDto myRank,
        List<LeaderboardRankDto> topPlayers,
        List<LeaderboardRankDto> nearbyPlayers,
        String privacyTip
) {
}
