package com.example.k12learninggame.api;

import com.example.k12learninggame.dto.CompleteLevelRequest;
import com.example.k12learninggame.dto.CompleteLevelResponse;
import com.example.k12learninggame.dto.HomeOverviewResponse;
import com.example.k12learninggame.dto.AchievementsResponse;
import com.example.k12learninggame.dto.AuthLoginRequest;
import com.example.k12learninggame.dto.AuthRegisterRequest;
import com.example.k12learninggame.dto.AuthSessionResponse;
import com.example.k12learninggame.dto.ContentConfigCatalogResponse;
import com.example.k12learninggame.dto.ContentConfigDetailResponse;
import com.example.k12learninggame.dto.ContentConfigUpdateRequest;
import com.example.k12learninggame.dto.ChildProfileDto;
import com.example.k12learninggame.dto.ChildProfileUpsertRequest;
import com.example.k12learninggame.dto.DailyTaskBoardResponse;
import com.example.k12learninggame.dto.DailyTaskClaimResponse;
import com.example.k12learninggame.dto.FluencyAttemptRequest;
import com.example.k12learninggame.dto.FluencyAttemptResponse;
import com.example.k12learninggame.dto.LeaderboardResponse;
import com.example.k12learninggame.dto.LearningPathResponse;
import com.example.k12learninggame.dto.LevelDetailResponse;
import com.example.k12learninggame.dto.MistakeReviewCenterResponse;
import com.example.k12learninggame.dto.MistakeReviewSubmitRequest;
import com.example.k12learninggame.dto.MistakeReviewSubmitResponse;
import com.example.k12learninggame.dto.ParentActiveChildUpdateRequest;
import com.example.k12learninggame.dto.ParentDashboardResponse;
import com.example.k12learninggame.dto.ParentSettingsDto;
import com.example.k12learninggame.dto.ParentSettingsUpdateRequest;
import com.example.k12learninggame.dto.SessionChildrenResponse;
import com.example.k12learninggame.dto.SubjectMapResponse;
import com.example.k12learninggame.service.GameContentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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

    @GetMapping("/session/children")
    public SessionChildrenResponse sessionChildren() {
        return gameContentService.getSessionChildren();
    }

    @PostMapping("/auth/login")
    public AuthSessionResponse login(@Valid @RequestBody AuthLoginRequest request) {
        return gameContentService.login(request);
    }

    @PostMapping("/auth/register")
    public AuthSessionResponse register(@Valid @RequestBody AuthRegisterRequest request) {
        return gameContentService.register(request);
    }

    @PostMapping("/parent/children")
    public ChildProfileDto createChildProfile(
            @RequestHeader("X-Parent-Account-Id") Long parentAccountId,
            @Valid @RequestBody ChildProfileUpsertRequest request
    ) {
        return gameContentService.createChildProfile(parentAccountId, request);
    }

    @PatchMapping("/parent/children/{childProfileId}")
    public ChildProfileDto updateChildProfile(
            @RequestHeader("X-Parent-Account-Id") Long parentAccountId,
            @PathVariable Long childProfileId,
            @Valid @RequestBody ChildProfileUpsertRequest request
    ) {
        return gameContentService.updateChildProfile(parentAccountId, childProfileId, request);
    }

    @PatchMapping("/parent/active-child")
    public AuthSessionResponse updateActiveChild(
            @RequestHeader("X-Parent-Account-Id") Long parentAccountId,
            @Valid @RequestBody ParentActiveChildUpdateRequest request
    ) {
        return gameContentService.updateActiveChild(parentAccountId, request);
    }

    @GetMapping("/home/overview")
    public HomeOverviewResponse homeOverview(
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId
    ) {
        return gameContentService.getHomeOverview(childProfileId);
    }

    @GetMapping("/daily-tasks")
    public DailyTaskBoardResponse dailyTasks(
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId
    ) {
        return gameContentService.getDailyTasks(childProfileId);
    }

    @PostMapping("/daily-tasks/{taskCode}/claim")
    public DailyTaskClaimResponse claimDailyTask(
            @PathVariable String taskCode,
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId
    ) {
        return gameContentService.claimDailyTask(taskCode, childProfileId);
    }

    @PostMapping("/fluency/attempts")
    public FluencyAttemptResponse recordFluencyAttempt(
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId,
            @Valid @RequestBody FluencyAttemptRequest request
    ) {
        return gameContentService.recordFluencyAttempt(childProfileId, request);
    }

    @GetMapping("/mistakes/review")
    public MistakeReviewCenterResponse mistakesReview(
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId
    ) {
        return gameContentService.getMistakeReviewCenter(childProfileId);
    }

    @PostMapping("/mistakes/review/{levelCode}/submit")
    public MistakeReviewSubmitResponse submitMistakeReview(
            @PathVariable String levelCode,
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId,
            @Valid @RequestBody MistakeReviewSubmitRequest request
    ) {
        return gameContentService.submitMistakeReview(levelCode, childProfileId, request);
    }

    @GetMapping("/learning-path")
    public LearningPathResponse learningPath(
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId
    ) {
        return gameContentService.getLearningPath(childProfileId);
    }

    @GetMapping("/content/configs")
    public ContentConfigCatalogResponse contentConfigs() {
        return gameContentService.getContentConfigCatalog();
    }

    @GetMapping("/content/configs/{levelCode}")
    public ContentConfigDetailResponse contentConfigDetail(@PathVariable String levelCode) {
        return gameContentService.getContentConfigDetail(levelCode);
    }

    @PatchMapping("/content/configs/{levelCode}")
    public ContentConfigDetailResponse updateContentConfigDetail(
            @PathVariable String levelCode,
            @Valid @RequestBody ContentConfigUpdateRequest request
    ) {
        return gameContentService.updateContentConfig(levelCode, request);
    }

    @GetMapping("/parent/dashboard")
    public ParentDashboardResponse parentDashboard(
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId
    ) {
        return gameContentService.getParentDashboard(childProfileId);
    }

    @PatchMapping("/parent/settings")
    public ParentSettingsDto updateParentSettings(
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId,
            @Valid @RequestBody ParentSettingsUpdateRequest request
    ) {
        return gameContentService.updateParentSettings(childProfileId, request);
    }

    @GetMapping("/leaderboard/weekly")
    public LeaderboardResponse weeklyLeaderboard(
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId
    ) {
        return gameContentService.getLeaderboard("weekly_star", childProfileId);
    }

    @GetMapping("/leaderboard/{boardType}")
    public LeaderboardResponse leaderboard(
            @PathVariable String boardType,
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId
    ) {
        return gameContentService.getLeaderboard(boardType, childProfileId);
    }

    @GetMapping("/achievements")
    public AchievementsResponse achievements(
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId
    ) {
        return gameContentService.getAchievements(childProfileId);
    }

    @GetMapping("/subjects/{subjectCode}/map")
    public SubjectMapResponse subjectMap(
            @PathVariable String subjectCode,
            @RequestHeader(value = "X-Child-Profile-Id", required = false) Long childProfileId
    ) {
        return gameContentService.getSubjectMap(subjectCode, childProfileId);
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
