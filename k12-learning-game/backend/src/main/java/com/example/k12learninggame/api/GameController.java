package com.example.k12learninggame.api;

import com.example.k12learninggame.dto.CompleteLevelRequest;
import com.example.k12learninggame.dto.CompleteLevelResponse;
import com.example.k12learninggame.dto.HomeOverviewResponse;
import com.example.k12learninggame.dto.LeaderboardResponse;
import com.example.k12learninggame.dto.LevelDetailResponse;
import com.example.k12learninggame.dto.ParentDashboardResponse;
import com.example.k12learninggame.dto.SubjectMapResponse;
import com.example.k12learninggame.service.GameContentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class GameController {

    private final GameContentService gameContentService;

    public GameController(GameContentService gameContentService) {
        this.gameContentService = gameContentService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @GetMapping("/home/overview")
    public HomeOverviewResponse homeOverview() {
        return gameContentService.getHomeOverview();
    }

    @GetMapping("/parent/dashboard")
    public ParentDashboardResponse parentDashboard() {
        return gameContentService.getParentDashboard();
    }

    @GetMapping("/leaderboard/weekly")
    public LeaderboardResponse weeklyLeaderboard() {
        return gameContentService.getWeeklyLeaderboard();
    }

    @GetMapping("/subjects/{subjectCode}/map")
    public SubjectMapResponse subjectMap(@PathVariable String subjectCode) {
        return gameContentService.getSubjectMap(subjectCode);
    }

    @GetMapping("/levels/{levelCode}")
    public LevelDetailResponse level(@PathVariable String levelCode) {
        return gameContentService.getLevel(levelCode);
    }

    @PostMapping("/levels/{levelCode}/complete")
    public CompleteLevelResponse completeLevel(
            @PathVariable String levelCode,
            @Valid @RequestBody CompleteLevelRequest request
    ) {
        return gameContentService.completeLevel(levelCode, request);
    }
}
