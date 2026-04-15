package com.example.k12learninggame.service;

import com.example.k12learninggame.domain.ChildProfileEntity;
import com.example.k12learninggame.domain.LeaderboardBoardEntity;
import com.example.k12learninggame.domain.LeaderboardBucketType;
import com.example.k12learninggame.domain.LeaderboardEntryEntity;
import com.example.k12learninggame.domain.LevelCompletionEntity;
import com.example.k12learninggame.domain.LevelEntity;
import com.example.k12learninggame.domain.SubjectEntity;
import com.example.k12learninggame.dto.AchievementBadgeDto;
import com.example.k12learninggame.dto.AchievementPreviewDto;
import com.example.k12learninggame.dto.AchievementSummaryDto;
import com.example.k12learninggame.dto.AchievementsResponse;
import com.example.k12learninggame.dto.ChapterDto;
import com.example.k12learninggame.dto.ChildProfileDto;
import com.example.k12learninggame.dto.CompleteLevelRequest;
import com.example.k12learninggame.dto.CompleteLevelResponse;
import com.example.k12learninggame.dto.GoalProgressDto;
import com.example.k12learninggame.dto.HomeOverviewResponse;
import com.example.k12learninggame.dto.LeaderboardRankDto;
import com.example.k12learninggame.dto.LeaderboardResponse;
import com.example.k12learninggame.dto.LevelDetailResponse;
import com.example.k12learninggame.dto.LevelStepDto;
import com.example.k12learninggame.dto.LevelSummaryDto;
import com.example.k12learninggame.dto.ParentDashboardResponse;
import com.example.k12learninggame.dto.ParentSettingsDto;
import com.example.k12learninggame.dto.ParentSubjectProgressDto;
import com.example.k12learninggame.dto.ParentTodaySummaryDto;
import com.example.k12learninggame.dto.RewardDto;
import com.example.k12learninggame.dto.SubjectCardDto;
import com.example.k12learninggame.dto.SubjectDto;
import com.example.k12learninggame.dto.SubjectMapResponse;
import com.example.k12learninggame.dto.TrendPointDto;
import com.example.k12learninggame.dto.WeakPointDto;
import com.example.k12learninggame.repository.ChildProfileRepository;
import com.example.k12learninggame.repository.LeaderboardBoardRepository;
import com.example.k12learninggame.repository.LevelCompletionRepository;
import com.example.k12learninggame.repository.LevelRepository;
import com.example.k12learninggame.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@Transactional(readOnly = true)
public class GameContentService {

    private final ChildProfileRepository childProfileRepository;
    private final SubjectRepository subjectRepository;
    private final LevelRepository levelRepository;
    private final LeaderboardBoardRepository leaderboardBoardRepository;
    private final LevelCompletionRepository levelCompletionRepository;

    public GameContentService(
            ChildProfileRepository childProfileRepository,
            SubjectRepository subjectRepository,
            LevelRepository levelRepository,
            LeaderboardBoardRepository leaderboardBoardRepository,
            LevelCompletionRepository levelCompletionRepository
    ) {
        this.childProfileRepository = childProfileRepository;
        this.subjectRepository = subjectRepository;
        this.levelRepository = levelRepository;
        this.leaderboardBoardRepository = leaderboardBoardRepository;
        this.levelCompletionRepository = levelCompletionRepository;
    }

    public HomeOverviewResponse getHomeOverview() {
        ChildProfileEntity child = getDefaultChild();

        return new HomeOverviewResponse(
                toChildProfileDto(child),
                subjectRepository.findAllByOrderByDisplayOrderAsc().stream()
                        .map(subject -> new SubjectCardDto(
                                subject.getCode(),
                                subject.getTitle(),
                                subject.getSubtitle(),
                                subject.getAccentColor()
                        ))
                        .toList(),
                new AchievementPreviewDto(6, 10, "本周小冠军")
        );
    }

    public SubjectMapResponse getSubjectMap(String subjectCode) {
        SubjectEntity subject = subjectRepository.findById(subjectCode)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Subject not found"));

        return new SubjectMapResponse(
                new SubjectDto(subject.getCode(), subject.getTitle()),
                subject.getChapters().stream()
                        .map(chapter -> new ChapterDto(
                                chapter.getCode(),
                                chapter.getTitle(),
                                chapter.getSubtitle(),
                                chapter.getLevels().stream()
                                        .map(level -> new LevelSummaryDto(level.getCode(), level.getSummaryTitle(), level.getStatus()))
                                        .toList()
                        ))
                        .toList()
        );
    }

    public LevelDetailResponse getLevel(String levelCode) {
        LevelEntity level = levelRepository.findById(levelCode)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Level not found"));

        return toLevelDetail(level);
    }

    @Transactional
    public CompleteLevelResponse completeLevel(String levelCode, CompleteLevelRequest request) {
        LevelEntity level = levelRepository.findById(levelCode)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Level not found"));
        ChildProfileEntity child = childProfileRepository.findById(request.childProfileId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Child not found"));

        String resultMessage = request.correctCount() == level.getSteps().size() ? "perfect" : "completed";
        levelCompletionRepository.save(new LevelCompletionEntity(
                child,
                level,
                request.correctCount(),
                request.wrongCount(),
                request.durationSeconds(),
                resultMessage,
                LocalDateTime.now()
        ));

        return new CompleteLevelResponse(
                levelCode,
                new RewardDto(level.getRewardStars(), level.getRewardBadgeName()),
                resultMessage
        );
    }

    public ParentDashboardResponse getParentDashboard() {
        ChildProfileEntity child = getDefaultChild();
        int goalMinutes = child.getParentSettings().getDailyStudyMinutes();
        int completedMinutes = child.getTodaySummary().getStudyMinutes();
        int completionPercent = Math.min((completedMinutes * 100) / Math.max(goalMinutes, 1), 100);

        return new ParentDashboardResponse(
                child.getNickname(),
                new ParentTodaySummaryDto(
                        child.getTodaySummary().getCompletedLevels(),
                        child.getTodaySummary().getStudyMinutes(),
                        child.getTodaySummary().getEarnedStars()
                ),
                child.getSubjectProgressRecords().stream()
                        .map(item -> new ParentSubjectProgressDto(
                                item.getSubject().getCode(),
                                item.getSubject().getTitle(),
                                item.getProgressPercent()
                        ))
                        .toList(),
                child.getWeeklyTrendPoints().stream()
                        .map(item -> new TrendPointDto(item.getDayLabel(), item.getMinutes()))
                        .toList(),
                child.getWeakPoints().stream()
                        .map(item -> new WeakPointDto(item.getTitle(), item.getSuggestion()))
                        .toList(),
                new AchievementSummaryDto(6, "再完成 2 关点亮“本周小冠军”"),
                new GoalProgressDto(goalMinutes, completedMinutes, completionPercent),
                List.of(
                        "继续完成 20 以内减法",
                        "复习字母 S 到 Z"
                ),
                new ParentSettingsDto(
                        child.getParentSettings().isLeaderboardEnabled(),
                        child.getParentSettings().getDailyStudyMinutes()
                )
        );
    }

    public LeaderboardResponse getLeaderboard(String boardType) {
        LeaderboardBoardEntity board = leaderboardBoardRepository.findById(boardType)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Leaderboard not found"));

        return new LeaderboardResponse(
                board.getBoardType(),
                getBoardTitle(board.getBoardType()),
                board.getEntries().stream()
                        .filter(entry -> entry.getBucketType() == LeaderboardBucketType.SELF)
                        .findFirst()
                        .map(this::toLeaderboardRank)
                        .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Leaderboard self rank not found")),
                board.getEntries().stream()
                        .filter(entry -> entry.getBucketType() == LeaderboardBucketType.TOP)
                        .map(this::toLeaderboardRank)
                        .toList(),
                board.getEntries().stream()
                        .filter(entry -> entry.getBucketType() == LeaderboardBucketType.NEARBY)
                        .map(this::toLeaderboardRank)
                        .toList(),
                board.getPrivacyTip()
        );
    }

    public AchievementsResponse getAchievements() {
        ChildProfileEntity child = getDefaultChild();

        return new AchievementsResponse(
                child.getNickname(),
                6,
                10,
                List.of(
                        new AchievementBadgeDto("math_starter", "数字小达人", "完成第一组数字启蒙关卡", "已解锁", true),
                        new AchievementBadgeDto("phonics_listener", "拼音小耳朵", "完成拼音泡泡练习", "已解锁", true),
                        new AchievementBadgeDto("alphabet_captain", "全字母船长", "完成 26 个字母跟读", "已解锁", true)
                ),
                List.of(
                        new AchievementBadgeDto("weekly_champion", "本周小冠军", "本周再完成 2 关即可点亮", "2 / 4", false),
                        new AchievementBadgeDto("reading_morning", "晨读小达人", "再完成 1 本绘本", "1 / 2", false)
                )
        );
    }

    private ChildProfileEntity getDefaultChild() {
        return childProfileRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Child not found"));
    }

    private ChildProfileDto toChildProfileDto(ChildProfileEntity child) {
        return new ChildProfileDto(
                child.getId(),
                child.getNickname(),
                child.getStreakDays(),
                child.getTotalStars(),
                child.getTitle()
        );
    }

    private LevelDetailResponse toLevelDetail(LevelEntity level) {
        return new LevelDetailResponse(
                level.getCode(),
                level.getDetailTitle(),
                level.getChapter().getSubject().getTitle(),
                level.getDescription(),
                level.getSteps().stream()
                        .map(step -> new LevelStepDto(step.getStepCode(), step.getStepType(), step.getPrompt()))
                        .toList(),
                new RewardDto(level.getRewardStars(), level.getRewardBadgeName())
        );
    }

    private LeaderboardRankDto toLeaderboardRank(LeaderboardEntryEntity entry) {
        return new LeaderboardRankDto(
                entry.getRankNumber(),
                entry.getNickname(),
                entry.getStars(),
                entry.getTrendLabel()
        );
    }

    private String getBoardTitle(String boardType) {
        return switch (boardType) {
            case "weekly_star" -> "本周星星榜";
            case "streak_master" -> "连续学习榜";
            case "challenge_hero" -> "挑战达人榜";
            default -> "成长排行榜";
        };
    }
}
