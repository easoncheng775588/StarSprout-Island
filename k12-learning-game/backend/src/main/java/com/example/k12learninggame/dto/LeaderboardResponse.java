package com.example.k12learninggame.dto;

import java.util.List;

public record LeaderboardResponse(
        String boardType,
        String boardTitle,
        LeaderboardRankDto myRank,
        List<LeaderboardRankDto> topPlayers,
        List<LeaderboardRankDto> nearbyPlayers,
        String privacyTip
) {
}
