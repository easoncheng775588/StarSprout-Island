package com.example.k12learninggame.service;

import com.example.k12learninggame.domain.ChildProfileEntity;
import com.example.k12learninggame.domain.LeaderboardBoardEntity;
import com.example.k12learninggame.domain.LeaderboardBucketType;
import com.example.k12learninggame.domain.LeaderboardEntryEntity;
import com.example.k12learninggame.domain.LevelCompletionEntity;
import com.example.k12learninggame.domain.LevelEntity;
import com.example.k12learninggame.domain.SubjectEntity;
import com.example.k12learninggame.dto.ChapterDto;
import com.example.k12learninggame.dto.ChildProfileDto;
import com.example.k12learninggame.dto.CompleteLevelRequest;
import com.example.k12learninggame.dto.CompleteLevelResponse;
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
                        .toList()
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
                new ParentSettingsDto(
                        child.getParentSettings().isLeaderboardEnabled(),
                        child.getParentSettings().getDailyStudyMinutes()
                )
        );
    }

    public LeaderboardResponse getWeeklyLeaderboard() {
        LeaderboardBoardEntity board = leaderboardBoardRepository.findById("weekly_star")
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Leaderboard not found"));

        return new LeaderboardResponse(
                board.getBoardType(),
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
}
