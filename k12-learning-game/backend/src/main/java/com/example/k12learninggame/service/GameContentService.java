package com.example.k12learninggame.service;

import com.example.k12learninggame.domain.ChildProfileEntity;
import com.example.k12learninggame.domain.LeaderboardBoardEntity;
import com.example.k12learninggame.domain.LevelCompletionEntity;
import com.example.k12learninggame.domain.LevelEntity;
import com.example.k12learninggame.domain.ParentAccountEntity;
import com.example.k12learninggame.domain.SubjectEntity;
import com.example.k12learninggame.dto.AchievementBadgeDto;
import com.example.k12learninggame.dto.AchievementPreviewDto;
import com.example.k12learninggame.dto.AchievementSummaryDto;
import com.example.k12learninggame.dto.AchievementsResponse;
import com.example.k12learninggame.dto.AuthLoginRequest;
import com.example.k12learninggame.dto.AuthRegisterRequest;
import com.example.k12learninggame.dto.AuthSessionResponse;
import com.example.k12learninggame.dto.ChapterDto;
import com.example.k12learninggame.dto.ChildProfileDto;
import com.example.k12learninggame.dto.ChildProfileUpsertRequest;
import com.example.k12learninggame.dto.CompleteLevelRequest;
import com.example.k12learninggame.dto.CompleteLevelResponse;
import com.example.k12learninggame.dto.GoalProgressDto;
import com.example.k12learninggame.dto.HomeOverviewResponse;
import com.example.k12learninggame.dto.LeaderboardRankDto;
import com.example.k12learninggame.dto.LeaderboardResponse;
import com.example.k12learninggame.dto.LearningVitalsDto;
import com.example.k12learninggame.dto.LevelDetailResponse;
import com.example.k12learninggame.dto.LevelStepDto;
import com.example.k12learninggame.dto.LevelSummaryDto;
import com.example.k12learninggame.dto.ParentDashboardResponse;
import com.example.k12learninggame.dto.ParentSettingsDto;
import com.example.k12learninggame.dto.ParentActiveChildUpdateRequest;
import com.example.k12learninggame.dto.ParentSettingsUpdateRequest;
import com.example.k12learninggame.dto.ParentSubjectInsightDto;
import com.example.k12learninggame.dto.ParentSubjectProgressDto;
import com.example.k12learninggame.dto.ParentTodaySummaryDto;
import com.example.k12learninggame.dto.RecommendedActionDto;
import com.example.k12learninggame.dto.RecentActivityDto;
import com.example.k12learninggame.dto.RewardDto;
import com.example.k12learninggame.dto.SessionChildrenResponse;
import com.example.k12learninggame.dto.SubjectCardDto;
import com.example.k12learninggame.dto.SubjectDto;
import com.example.k12learninggame.dto.SubjectMapResponse;
import com.example.k12learninggame.dto.TrendPointDto;
import com.example.k12learninggame.dto.WeakPointDto;
import com.example.k12learninggame.repository.ChildProfileRepository;
import com.example.k12learninggame.repository.LeaderboardBoardRepository;
import com.example.k12learninggame.repository.LevelCompletionRepository;
import com.example.k12learninggame.repository.LevelRepository;
import com.example.k12learninggame.repository.ParentAccountRepository;
import com.example.k12learninggame.repository.ParentSettingsRepository;
import com.example.k12learninggame.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
@Transactional(readOnly = true)
public class GameContentService {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private final ChildProfileRepository childProfileRepository;
    private final SubjectRepository subjectRepository;
    private final LevelRepository levelRepository;
    private final LeaderboardBoardRepository leaderboardBoardRepository;
    private final LevelCompletionRepository levelCompletionRepository;
    private final ParentAccountRepository parentAccountRepository;
    private final ParentSettingsRepository parentSettingsRepository;

    public GameContentService(
            ChildProfileRepository childProfileRepository,
            SubjectRepository subjectRepository,
            LevelRepository levelRepository,
            LeaderboardBoardRepository leaderboardBoardRepository,
            LevelCompletionRepository levelCompletionRepository,
            ParentAccountRepository parentAccountRepository,
            ParentSettingsRepository parentSettingsRepository
    ) {
        this.childProfileRepository = childProfileRepository;
        this.subjectRepository = subjectRepository;
        this.levelRepository = levelRepository;
        this.leaderboardBoardRepository = leaderboardBoardRepository;
        this.levelCompletionRepository = levelCompletionRepository;
        this.parentAccountRepository = parentAccountRepository;
        this.parentSettingsRepository = parentSettingsRepository;
    }

    public AuthSessionResponse login(AuthLoginRequest request) {
        ParentAccountEntity parentAccount = parentAccountRepository.findByPhone(request.phone())
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Invalid account"));
        if (!parentAccount.getPassword().equals(request.password())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid account");
        }

        return toAuthSessionResponse(parentAccount);
    }

    @Transactional
    public AuthSessionResponse register(AuthRegisterRequest request) {
        parentAccountRepository.findByPhone(request.phone())
                .ifPresent(existing -> {
                    throw new ResponseStatusException(CONFLICT, "Phone already registered");
                });

        long nextId = parentAccountRepository.findAll().stream()
                .mapToLong(ParentAccountEntity::getId)
                .max()
                .orElse(0L) + 1;
        ParentAccountEntity parentAccount = new ParentAccountEntity(
                nextId,
                request.displayName(),
                request.phone(),
                request.password(),
                null
        );

        return toAuthSessionResponse(parentAccountRepository.save(parentAccount));
    }

    public SessionChildrenResponse getSessionChildren() {
        List<ChildProfileEntity> children = childProfileRepository.findAllByOrderByIdAsc();
        ChildProfileEntity defaultChild = children.stream()
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Child not found"));

        return new SessionChildrenResponse(
                defaultChild.getId(),
                children.stream().map(this::toChildProfileDto).toList()
        );
    }

    @Transactional
    public ChildProfileDto createChildProfile(Long parentAccountId, ChildProfileUpsertRequest request) {
        ParentAccountEntity parentAccount = parentAccountRepository.findById(parentAccountId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Parent account not found"));
        long nextId = childProfileRepository.findAllByOrderByIdAsc().stream()
                .mapToLong(ChildProfileEntity::getId)
                .max()
                .orElse(0L) + 1;

        ChildProfileEntity child = new ChildProfileEntity(
                nextId,
                request.nickname(),
                0,
                0,
                request.title(),
                request.stageLabel(),
                request.avatarColor(),
                parentAccount
        );
        if (parentAccount.getDefaultChildProfileId() == null) {
            parentAccount.setDefaultChildProfileId(nextId);
        }

        return toChildProfileDto(childProfileRepository.save(child));
    }

    @Transactional
    public ChildProfileDto updateChildProfile(Long parentAccountId, Long childProfileId, ChildProfileUpsertRequest request) {
        ChildProfileEntity child = getChildForParent(parentAccountId, childProfileId);
        child.setNickname(request.nickname());
        child.setTitle(request.title());
        child.setStageLabel(request.stageLabel());
        child.setAvatarColor(request.avatarColor());

        return toChildProfileDto(childProfileRepository.save(child));
    }

    @Transactional
    public AuthSessionResponse updateActiveChild(Long parentAccountId, ParentActiveChildUpdateRequest request) {
        ParentAccountEntity parentAccount = parentAccountRepository.findById(parentAccountId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Parent account not found"));
        ChildProfileEntity child = getChildForParent(parentAccountId, request.childProfileId());
        parentAccount.setDefaultChildProfileId(child.getId());

        return toAuthSessionResponse(parentAccount);
    }

    public HomeOverviewResponse getHomeOverview(Long childProfileId) {
        ChildProfileEntity child = getChild(childProfileId);
        AchievementsResponse achievements = buildAchievements(child);
        LevelEntity nextLevel = findNextIncompleteLevel(child);

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
                new AchievementPreviewDto(
                        achievements.unlockedCount(),
                        achievements.totalCount(),
                        achievements.inProgressBadges().stream()
                                .findFirst()
                                .map(AchievementBadgeDto::title)
                                .orElse("继续加油章")
                ),
                "启航岛",
                nextLevel != null
                        ? "继续挑战 " + nextLevel.getSummaryTitle() + "，把今天的学习星轨再点亮一格。"
                        : "今天已经完成主线任务，回顾一下最喜欢的关卡吧。",
                nextLevel != null ? nextLevel.getCode() : null,
                nextLevel != null ? nextLevel.getSummaryTitle() : null
        );
    }

    public SubjectMapResponse getSubjectMap(String subjectCode, Long childProfileId) {
        ChildProfileEntity child = getChild(childProfileId);
        SubjectEntity subject = subjectRepository.findById(subjectCode)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Subject not found"));
        Set<String> completedLevelCodes = getCompletedLevelCodes(child);
        String firstIncompleteCode = findFirstIncompleteLevelCode(subject, completedLevelCodes);

        return new SubjectMapResponse(
                new SubjectDto(subject.getCode(), subject.getTitle()),
                subject.getChapters().stream()
                        .map(chapter -> new ChapterDto(
                                chapter.getCode(),
                                chapter.getTitle(),
                                chapter.getSubtitle(),
                                chapter.getLevels().stream()
                                        .map(level -> new LevelSummaryDto(
                                                level.getCode(),
                                                level.getSummaryTitle(),
                                                resolveLevelStatus(level.getCode(), completedLevelCodes, firstIncompleteCode)
                                        ))
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
        Set<String> unlockedBadgeCodesBeforeCompletion = buildAchievements(child).unlockedBadges().stream()
                .map(AchievementBadgeDto::code)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        boolean isFirstCompletion = levelCompletionRepository.findAll().stream()
                .noneMatch(item -> item.getChildProfile().getId().equals(child.getId())
                        && item.getLevel().getCode().equals(levelCode));

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
        int effectiveStars = isFirstCompletion ? level.getRewardStars() : 0;
        if (effectiveStars > 0) {
            child.addStars(effectiveStars);
        }
        List<AchievementBadgeDto> newlyUnlockedBadges = buildAchievements(child).unlockedBadges().stream()
                .filter(badge -> !unlockedBadgeCodesBeforeCompletion.contains(badge.code()))
                .toList();

        return new CompleteLevelResponse(
                levelCode,
                new RewardDto(level.getRewardStars(), level.getRewardBadgeName()),
                resultMessage,
                isFirstCompletion,
                effectiveStars,
                child.getTotalStars(),
                newlyUnlockedBadges
        );
    }

    public ParentDashboardResponse getParentDashboard(Long childProfileId) {
        ChildProfileEntity child = getChild(childProfileId);
        List<LevelCompletionEntity> completions = getChildCompletions(child);
        List<LevelCompletionEntity> todayCompletions = completions.stream()
                .filter(item -> item.getCompletedAt().toLocalDate().isEqual(LocalDate.now()))
                .toList();
        List<ParentSubjectProgressDto> subjectProgress = buildSubjectProgress(child);
        AchievementsResponse achievements = buildAchievements(child);
        int goalMinutes = child.getParentSettings() != null ? child.getParentSettings().getDailyStudyMinutes() : 20;
        int completedMinutes = toRoundedMinutes(todayCompletions);
        int completionPercent = Math.min((completedMinutes * 100) / Math.max(goalMinutes, 1), 100);
        LearningVitalsDto learningVitals = new LearningVitalsDto(
                getCompletedLevelCodes(child).size(),
                calculateAverageAccuracyPercent(completions),
                subjectProgress.stream()
                        .max(Comparator.comparingInt(ParentSubjectProgressDto::progressPercent))
                        .map(ParentSubjectProgressDto::subjectTitle)
                        .orElse("数学岛"),
                calculateAverageSessionMinutes(completions),
                findBestLearningPeriodLabel(completions),
                countEffectiveLearningDays(child, 7)
        );

        return new ParentDashboardResponse(
                child.getNickname(),
                new ParentTodaySummaryDto(
                        todayCompletions.size(),
                        completedMinutes,
                        todayCompletions.stream().mapToInt(item -> item.getLevel().getRewardStars()).sum()
                ),
                subjectProgress,
                buildWeeklyTrend(completions),
                buildWeakPoints(child, completions),
                new AchievementSummaryDto(
                        achievements.unlockedCount(),
                        achievements.inProgressBadges().stream()
                                .findFirst()
                                .map(badge -> "下一枚最接近的是“" + badge.title() + "”（" + badge.progressText() + "）")
                                .orElse("今天的成就节奏很不错")
                ),
                new GoalProgressDto(goalMinutes, completedMinutes, completionPercent),
                buildRecommendedActions(child, 2),
                new ParentSettingsDto(
                        child.getParentSettings() == null || child.getParentSettings().isLeaderboardEnabled(),
                        goalMinutes,
                        child.getParentSettings() != null && child.getParentSettings().isReminderEnabled()
                ),
                learningVitals,
                buildSubjectInsights(child, completions),
                completions.stream()
                        .limit(3)
                        .map(this::toRecentActivityDto)
                        .toList()
        );
    }

    public LeaderboardResponse getLeaderboard(String boardType, Long childProfileId) {
        ChildProfileEntity child = getChild(childProfileId);
        LeaderboardBoardEntity board = leaderboardBoardRepository.findById(boardType)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Leaderboard not found"));
        boolean participationEnabled = child.getParentSettings() == null || child.getParentSettings().isLeaderboardEnabled();

        List<RankedChild> rankedChildren = childProfileRepository.findAllByOrderByIdAsc().stream()
                .filter(profile -> profile.getParentSettings() == null || profile.getParentSettings().isLeaderboardEnabled())
                .map(profile -> new RankedChild(
                        profile,
                        scoreForBoard(boardType, profile),
                        trendLabelForBoard(boardType, scoreForBoard(boardType, profile)),
                        latestActivityAt(profile)
                ))
                .sorted(Comparator
                        .comparingInt(RankedChild::score)
                        .reversed()
                        .thenComparing(RankedChild::latestActivityAt, Comparator.reverseOrder())
                        .thenComparing(item -> item.child().getId()))
                .toList();

        if (!participationEnabled) {
            return new LeaderboardResponse(
                    boardType,
                    getBoardTitle(boardType),
                    metricUnitForBoard(boardType),
                    false,
                    settlementWindowLabelForBoard(boardType),
                    "今天 " + TIME_FORMATTER.format(LocalDateTime.now()) + " 更新",
                    "当前孩子未参与榜单展示",
                    new LeaderboardRankDto(0, child.getNickname(), 0, "未参与排行榜"),
                    rankedChildren.stream().limit(3).map(item -> toLeaderboardRank(item, rankedChildren.indexOf(item) + 1)).toList(),
                    List.of(),
                    board.getPrivacyTip()
            );
        }

        int myIndex = findRankIndex(rankedChildren, child.getId());
        int nearbyStart = Math.max(0, myIndex - 1);
        int nearbyEnd = Math.min(rankedChildren.size(), myIndex + 2);

        return new LeaderboardResponse(
                boardType,
                getBoardTitle(boardType),
                metricUnitForBoard(boardType),
                true,
                settlementWindowLabelForBoard(boardType),
                "今天 " + TIME_FORMATTER.format(LocalDateTime.now()) + " 更新",
                buildNextTargetText(boardType, rankedChildren, myIndex, child),
                toLeaderboardRank(rankedChildren.get(myIndex), myIndex + 1),
                rankedChildren.stream().limit(3).map(item -> toLeaderboardRank(item, rankedChildren.indexOf(item) + 1)).toList(),
                rankedChildren.subList(nearbyStart, nearbyEnd).stream()
                        .map(item -> toLeaderboardRank(item, rankedChildren.indexOf(item) + 1))
                        .toList(),
                board.getPrivacyTip()
        );
    }

    @Transactional
    public ParentSettingsDto updateParentSettings(Long childProfileId, ParentSettingsUpdateRequest request) {
        ChildProfileEntity child = getChild(childProfileId);
        var settings = parentSettingsRepository.findById(child.getId())
                .orElseGet(() -> new com.example.k12learninggame.domain.ParentSettingsEntity(
                        child,
                        request.leaderboardEnabled(),
                        request.dailyStudyMinutes(),
                        request.reminderEnabled()
                ));
        settings.update(
                request.leaderboardEnabled(),
                request.dailyStudyMinutes(),
                request.reminderEnabled()
        );
        parentSettingsRepository.save(settings);

        return new ParentSettingsDto(
                settings.isLeaderboardEnabled(),
                settings.getDailyStudyMinutes(),
                settings.isReminderEnabled()
        );
    }

    public AchievementsResponse getAchievements(Long childProfileId) {
        return buildAchievements(getChild(childProfileId));
    }

    private ChildProfileEntity getChild(Long childProfileId) {
        if (childProfileId == null) {
            return childProfileRepository.findFirstByOrderByIdAsc()
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Child not found"));
        }

        return childProfileRepository.findById(childProfileId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Child not found"));
    }

    private ChildProfileEntity getChildForParent(Long parentAccountId, Long childProfileId) {
        ChildProfileEntity child = childProfileRepository.findById(childProfileId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Child not found"));

        if (!child.getParentAccount().getId().equals(parentAccountId)) {
            throw new ResponseStatusException(UNAUTHORIZED, "Child does not belong to parent");
        }

        return child;
    }

    private AuthSessionResponse toAuthSessionResponse(ParentAccountEntity parentAccount) {
        List<ChildProfileDto> children = parentAccount.getChildProfiles().stream()
                .map(this::toChildProfileDto)
                .toList();
        long defaultChildId = Optional.ofNullable(parentAccount.getDefaultChildProfileId())
                .orElseGet(() -> children.stream().findFirst().map(ChildProfileDto::id).orElse(0L));

        return new AuthSessionResponse(
                parentAccount.getId(),
                parentAccount.getDisplayName(),
                defaultChildId,
                children
        );
    }

    private List<LevelCompletionEntity> getChildCompletions(ChildProfileEntity child) {
        return levelCompletionRepository.findAll().stream()
                .filter(item -> item.getChildProfile().getId().equals(child.getId()))
                .sorted(Comparator.comparing(LevelCompletionEntity::getCompletedAt).reversed())
                .toList();
    }

    private Set<String> getCompletedLevelCodes(ChildProfileEntity child) {
        return getChildCompletions(child).stream()
                .map(item -> item.getLevel().getCode())
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private LevelEntity findNextIncompleteLevel(ChildProfileEntity child) {
        Set<String> completedLevelCodes = getCompletedLevelCodes(child);

        return subjectRepository.findAllByOrderByDisplayOrderAsc().stream()
                .flatMap(subject -> subject.getChapters().stream())
                .flatMap(chapter -> chapter.getLevels().stream())
                .filter(level -> !completedLevelCodes.contains(level.getCode()))
                .findFirst()
                .orElse(null);
    }

    private String findFirstIncompleteLevelCode(SubjectEntity subject, Set<String> completedLevelCodes) {
        return subject.getChapters().stream()
                .flatMap(chapter -> chapter.getLevels().stream())
                .filter(level -> !completedLevelCodes.contains(level.getCode()))
                .map(LevelEntity::getCode)
                .findFirst()
                .orElse(null);
    }

    private String resolveLevelStatus(String levelCode, Set<String> completedLevelCodes, String firstIncompleteCode) {
        if (completedLevelCodes.contains(levelCode)) {
            return "completed";
        }

        if (levelCode.equals(firstIncompleteCode)) {
            return "recommended";
        }

        return "available";
    }

    private List<ParentSubjectProgressDto> buildSubjectProgress(ChildProfileEntity child) {
        Set<String> completedLevelCodes = getCompletedLevelCodes(child);

        return subjectRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(subject -> {
                    long totalLevels = subject.getChapters().stream().flatMap(chapter -> chapter.getLevels().stream()).count();
                    long completedLevels = subject.getChapters().stream()
                            .flatMap(chapter -> chapter.getLevels().stream())
                            .map(LevelEntity::getCode)
                            .filter(completedLevelCodes::contains)
                            .count();

                    return new ParentSubjectProgressDto(
                            subject.getCode(),
                            subject.getTitle(),
                            totalLevels == 0 ? 0 : (int) Math.round(completedLevels * 100.0 / totalLevels)
                    );
                })
                .toList();
    }

    private List<ParentSubjectInsightDto> buildSubjectInsights(ChildProfileEntity child, List<LevelCompletionEntity> completions) {
        Set<String> completedLevelCodes = getCompletedLevelCodes(child);

        return subjectRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(subject -> {
                    List<LevelEntity> subjectLevels = subject.getChapters().stream()
                            .flatMap(chapter -> chapter.getLevels().stream())
                            .toList();
                    List<LevelCompletionEntity> subjectCompletions = completions.stream()
                            .filter(item -> item.getLevel().getChapter().getSubject().getCode().equals(subject.getCode()))
                            .toList();
                    long completedLevels = subjectLevels.stream()
                            .map(LevelEntity::getCode)
                            .filter(completedLevelCodes::contains)
                            .count();
                    int totalAttempts = subjectCompletions.stream()
                            .mapToInt(item -> item.getCorrectCount() + item.getWrongCount())
                            .sum();
                    int totalCorrect = subjectCompletions.stream().mapToInt(LevelCompletionEntity::getCorrectCount).sum();
                    int accuracyPercent = totalAttempts == 0 ? 0 : (int) Math.round(totalCorrect * 100.0 / totalAttempts);
                    String nextLevelTitle = subjectLevels.stream()
                            .filter(level -> !completedLevelCodes.contains(level.getCode()))
                            .map(LevelEntity::getSummaryTitle)
                            .findFirst()
                            .orElse("本学科主线已完成");
                    String nextLevelReason = buildNextLevelReason(subject.getTitle(), completedLevels, accuracyPercent, nextLevelTitle);

                    return new ParentSubjectInsightDto(
                            subject.getCode(),
                            subject.getTitle(),
                            (int) completedLevels,
                            subjectLevels.size(),
                            accuracyPercent,
                            toRoundedMinutes(subjectCompletions),
                            nextLevelTitle,
                            nextLevelReason
                    );
                })
                .toList();
    }

    private List<TrendPointDto> buildWeeklyTrend(List<LevelCompletionEntity> completions) {
        LocalDate startDate = LocalDate.now().minusDays(6);

        return java.util.stream.IntStream.rangeClosed(0, 6)
                .mapToObj(index -> {
                    LocalDate date = startDate.plusDays(index);
                    int minutes = toRoundedMinutes(completions.stream()
                            .filter(item -> item.getCompletedAt().toLocalDate().isEqual(date))
                            .toList());

                    return new TrendPointDto(dayLabel(date.getDayOfWeek()), minutes);
                })
                .toList();
    }

    private List<WeakPointDto> buildWeakPoints(ChildProfileEntity child, List<LevelCompletionEntity> completions) {
        int overallAccuracy = calculateAverageAccuracyPercent(completions);
        List<SubjectScore> subjectScores = subjectRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(subject -> {
                    List<LevelCompletionEntity> subjectCompletions = completions.stream()
                            .filter(item -> item.getLevel().getChapter().getSubject().getCode().equals(subject.getCode()))
                            .toList();
                    int totalAttempts = subjectCompletions.stream()
                            .mapToInt(item -> item.getCorrectCount() + item.getWrongCount())
                            .sum();
                    int totalCorrect = subjectCompletions.stream().mapToInt(LevelCompletionEntity::getCorrectCount).sum();
                    double accuracy = totalAttempts == 0 ? 0 : totalCorrect * 1.0 / totalAttempts;
                    String nextLevelTitle = subject.getChapters().stream()
                            .flatMap(chapter -> chapter.getLevels().stream())
                            .filter(level -> !getCompletedLevelCodes(child).contains(level.getCode()))
                            .map(LevelEntity::getSummaryTitle)
                            .findFirst()
                            .orElse("复习已完成的小关卡");

                    return new SubjectScore(subject.getTitle(), accuracy, nextLevelTitle);
                })
                .sorted(Comparator.comparingDouble(SubjectScore::accuracy))
                .toList();

        return subjectScores.stream()
                .limit(2)
                .map(score -> new WeakPointDto(
                        score.subjectTitle() + "还需要多一点细心练习",
                        "建议下一步继续挑战“" + score.nextLevelTitle() + "”，把准确率慢慢提上来。",
                        buildWeakPointReason(score.subjectTitle(), score.accuracy(), overallAccuracy)
                ))
                .toList();
    }

    private List<RecommendedActionDto> buildRecommendedActions(ChildProfileEntity child, int limit) {
        Set<String> completedLevelCodes = getCompletedLevelCodes(child);

        return subjectRepository.findAllByOrderByDisplayOrderAsc().stream()
                .flatMap(subject -> subject.getChapters().stream())
                .flatMap(chapter -> chapter.getLevels().stream())
                .filter(level -> !completedLevelCodes.contains(level.getCode()))
                .limit(limit)
                .map(level -> new RecommendedActionDto(
                        "继续挑战 " + level.getSummaryTitle(),
                        buildRecommendedActionReason(child, level),
                        level.getChapter().getSubject().getTitle()
                ))
                .toList();
    }

    private RecentActivityDto toRecentActivityDto(LevelCompletionEntity completion) {
        LocalDate completedDate = completion.getCompletedAt().toLocalDate();
        String completedAtLabel;

        if (completedDate.isEqual(LocalDate.now())) {
            completedAtLabel = "今天 " + TIME_FORMATTER.format(completion.getCompletedAt());
        } else if (completedDate.isEqual(LocalDate.now().minusDays(1))) {
            completedAtLabel = "昨天 " + TIME_FORMATTER.format(completion.getCompletedAt());
        } else {
            completedAtLabel = completion.getCompletedAt().getMonthValue() + "月"
                    + completion.getCompletedAt().getDayOfMonth() + "日 "
                    + TIME_FORMATTER.format(completion.getCompletedAt());
        }

        return new RecentActivityDto(
                completion.getLevel().getChapter().getSubject().getTitle(),
                completion.getLevel().getDetailTitle(),
                completedAtLabel,
                completion.getLevel().getRewardStars()
        );
    }

    private int toRoundedMinutes(List<LevelCompletionEntity> completions) {
        int totalSeconds = completions.stream().mapToInt(LevelCompletionEntity::getDurationSeconds).sum();
        if (totalSeconds == 0) {
            return 0;
        }

        return (totalSeconds + 59) / 60;
    }

    private int calculateAverageAccuracyPercent(List<LevelCompletionEntity> completions) {
        int correctCount = completions.stream().mapToInt(LevelCompletionEntity::getCorrectCount).sum();
        int totalAttempts = completions.stream().mapToInt(item -> item.getCorrectCount() + item.getWrongCount()).sum();
        if (totalAttempts == 0) {
            return 0;
        }

        return (int) Math.round(correctCount * 100.0 / totalAttempts);
    }

    private int calculateAverageSessionMinutes(List<LevelCompletionEntity> completions) {
        if (completions.isEmpty()) {
            return 0;
        }

        double totalMinutes = completions.stream()
                .mapToInt(LevelCompletionEntity::getDurationSeconds)
                .sum() / 60.0;
        return (int) Math.round(totalMinutes / completions.size());
    }

    private int countEffectiveLearningDays(ChildProfileEntity child, int days) {
        LocalDate windowStart = LocalDate.now().minusDays(days - 1L);

        return (int) getChildCompletions(child).stream()
                .map(item -> item.getCompletedAt().toLocalDate())
                .filter(date -> !date.isBefore(windowStart))
                .distinct()
                .count();
    }

    private String findBestLearningPeriodLabel(List<LevelCompletionEntity> completions) {
        return completions.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        completion -> learningPeriodBucket(completion.getCompletedAt().getHour()),
                        java.util.stream.Collectors.counting()
                ))
                .entrySet()
                .stream()
                .max(Comparator.<java.util.Map.Entry<String, Long>>comparingLong(java.util.Map.Entry::getValue)
                        .thenComparing(java.util.Map.Entry::getKey))
                .map(java.util.Map.Entry::getKey)
                .orElse("还在形成学习节奏");
    }

    private AchievementsResponse buildAchievements(ChildProfileEntity child) {
        Set<String> completedLevelCodes = getCompletedLevelCodes(child);
        long mathCount = completedLevelCodes.stream().filter(code -> code.startsWith("math-")).count();
        long pinyinCount = completedLevelCodes.stream().filter(code -> code.startsWith("chinese-pinyin-")).count();
        long strokeCount = completedLevelCodes.stream().filter(code -> code.startsWith("chinese-strokes-")).count();
        long englishLetterCount = completedLevelCodes.stream().filter(code -> code.startsWith("english-letters-")).count();
        long englishWordCount = completedLevelCodes.stream().filter(code -> code.startsWith("english-words-")).count();
        long storyCount = completedLevelCodes.stream().filter(code -> code.startsWith("english-story-")).count();
        List<LevelCompletionEntity> completions = getChildCompletions(child);
        long weeklyChallengeCount = getEffectiveCompletionsWithinDays(child, 7).size();
        long languageReadCount = pinyinCount + englishLetterCount + storyCount;
        int averageAccuracy = calculateAverageAccuracyPercent(completions);
        int totalStudyMinutes = toRoundedMinutes(completions);
        int activeStreakDays = calculateActiveStreakDays(child);

        List<AchievementBadgeDto> badges = List.of(
                createBadge("math_starter", "数字小达人", "完成 1 个数学关卡", mathCount, 1, "数学启蒙", "成长徽章"),
                createBadge("phonics_listener", "拼音小耳朵", "完成 1 个拼音关卡", pinyinCount, 1, "语文启蒙", "成长徽章"),
                createBadge("alphabet_sailor", "字母小船长", "完成 1 个英语字母关卡", englishLetterCount, 1, "英语启蒙", "成长徽章"),
                createBadge("story_reader", "绘本小海鸥", "完成 1 个英语绘本关卡", storyCount, 1, "英语朗读", "成长徽章"),
                createBadge("steady_streak", "小小坚持家", "连续学习 10 天", activeStreakDays, 10, "学习习惯", "闪亮徽章"),
                createBadge("math_explorer", "数学闯关家", "完成 5 个数学关卡", mathCount, 5, "数学启蒙", "闪亮徽章"),
                createBadge("weekly_champion", "本周小冠军", "7 天内完成 6 次挑战", weeklyChallengeCount, 6, "每周挑战", "闪亮徽章"),
                createBadge("language_runner", "朗读晨光星", "完成 4 个语言朗读关卡", languageReadCount, 4, "综合朗读", "闪亮徽章"),
                createBadge("stroke_painter", "笔顺小画家", "完成 2 个笔顺关卡", strokeCount, 2, "语文启蒙", "收藏徽章"),
                createBadge("word_collector", "单词小收藏家", "完成 3 个英语单词关卡", englishWordCount, 3, "英语启蒙", "收藏徽章"),
                createBadge("accuracy_guardian", "细心守护星", "平均准确率达到 90%", averageAccuracy, 90, "学习习惯", "收藏徽章"),
                createBadge("focus_runner", "专注小马达", "累计学习 40 分钟", totalStudyMinutes, 40, "学习习惯", "收藏徽章")
        );

        List<AchievementBadgeDto> unlockedBadges = badges.stream().filter(AchievementBadgeDto::unlocked).toList();
        List<AchievementBadgeDto> inProgressBadges = badges.stream()
                .filter(badge -> !badge.unlocked())
                .sorted(Comparator.comparingInt(AchievementBadgeDto::progressPercent).reversed())
                .toList();

        return new AchievementsResponse(
                child.getNickname(),
                unlockedBadges.size(),
                badges.size(),
                unlockedBadges,
                inProgressBadges
        );
    }

    private String buildWeakPointReason(String subjectTitle, double subjectAccuracy, int overallAccuracy) {
        int subjectAccuracyPercent = (int) Math.round(subjectAccuracy * 100);
        int gap = Math.max(overallAccuracy - subjectAccuracyPercent, 0);
        return "最近 7 天" + subjectTitle + "正确率 " + subjectAccuracyPercent + "%，比整体平均低了 " + gap + "%。";
    }

    private String buildRecommendedActionReason(ChildProfileEntity child, LevelEntity level) {
        String subjectTitle = level.getChapter().getSubject().getTitle();
        long completedInSubject = getCompletedLevelCodes(child).stream()
                .filter(code -> code.startsWith(level.getChapter().getSubject().getCode() + "-"))
                .count();

        if (completedInSubject == 0) {
            return "这是" + subjectTitle + "当前主线的起点，先从这里建立基础最轻松。";
        }

        return "这是" + subjectTitle + "当前主线的下一关，完成后能把这条学习路线继续接上。";
    }

    private String buildNextLevelReason(String subjectTitle, long completedLevels, int accuracyPercent, String nextLevelTitle) {
        if ("本学科主线已完成".equals(nextLevelTitle)) {
            return "这一科的主线已经完成，可以回头挑喜欢的关卡继续巩固。";
        }
        if (completedLevels == 0) {
            return "这一科还刚开始，先从当前推荐关建立最基础的认识。";
        }
        if (accuracyPercent >= 85) {
            return "前面的内容已经比较稳了，下一步正好继续推进主线。";
        }
        return "先接着当前主线往前走，用下一关把前面不太稳的点再练一练。";
    }

    private AchievementBadgeDto createBadge(
            String code,
            String title,
            String description,
            long current,
            long target,
            String category,
            String rarityLabel
    ) {
        boolean unlocked = current >= target;
        int progressPercent = target == 0 ? 100 : (int) Math.min(100, Math.round(current * 100.0 / target));
        return new AchievementBadgeDto(
                code,
                title,
                description,
                unlocked ? "已解锁" : current + " / " + target,
                unlocked,
                category,
                rarityLabel,
                progressPercent,
                unlocked ? "已经点亮，继续保持这份节奏" : "再完成 " + Math.max(target - current, 0) + " 个目标，就能点亮这枚徽章"
        );
    }

    private int scoreForBoard(String boardType, ChildProfileEntity child) {
        return switch (boardType) {
            case "weekly_star" -> getEffectiveCompletionsWithinDays(child, 7).stream()
                    .mapToInt(item -> item.getLevel().getRewardStars())
                    .sum();
            case "streak_master" -> calculateActiveStreakDays(child);
            case "challenge_hero" -> getEffectiveCompletionsWithinDays(child, 7).size();
            default -> child.getTotalStars();
        };
    }

    private String trendLabelForBoard(String boardType, int score) {
        return switch (boardType) {
            case "weekly_star" -> "本周收集 " + score + " 颗星星";
            case "streak_master" -> "已经连续学习 " + score + " 天";
            case "challenge_hero" -> "本周完成 " + score + " 次挑战";
            default -> "继续保持学习节奏";
        };
    }

    private String settlementWindowLabelForBoard(String boardType) {
        return switch (boardType) {
            case "weekly_star" -> "近 7 天星星结算";
            case "streak_master" -> "按自然日连续学习实时结算";
            case "challenge_hero" -> "近 7 天挑战次数结算";
            default -> "实时成长结算";
        };
    }

    private String buildNextTargetText(String boardType, List<RankedChild> rankedChildren, int myIndex, ChildProfileEntity child) {
        if (child.getParentSettings() != null && !child.getParentSettings().isLeaderboardEnabled()) {
            return "当前孩子未参与榜单展示";
        }

        if (myIndex == 0) {
            return "已经来到榜首，继续保持今天的节奏";
        }

        int gap = Math.max(0, rankedChildren.get(myIndex - 1).score() - rankedChildren.get(myIndex).score());
        if (gap == 0) {
            return "已经追平上一名，再完成一点点就能反超";
        }

        return "距离上一名还差 " + gap + " " + metricUnitForBoard(boardType);
    }

    private LeaderboardRankDto toLeaderboardRank(RankedChild rankedChild, int rank) {
        return new LeaderboardRankDto(
                rank,
                rankedChild.child().getNickname(),
                rankedChild.score(),
                rankedChild.trendLabel()
        );
    }

    private int findRankIndex(List<RankedChild> rankedChildren, Long childId) {
        for (int index = 0; index < rankedChildren.size(); index += 1) {
            if (rankedChildren.get(index).child().getId().equals(childId)) {
                return index;
            }
        }

        throw new ResponseStatusException(NOT_FOUND, "Child rank not found");
    }

    private ChildProfileDto toChildProfileDto(ChildProfileEntity child) {
        return new ChildProfileDto(
                child.getId(),
                child.getNickname(),
                calculateActiveStreakDays(child),
                child.getTotalStars(),
                child.getTitle(),
                child.getStageLabel(),
                child.getAvatarColor()
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

    private String dayLabel(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> "周一";
            case TUESDAY -> "周二";
            case WEDNESDAY -> "周三";
            case THURSDAY -> "周四";
            case FRIDAY -> "周五";
            case SATURDAY -> "周六";
            case SUNDAY -> "周日";
        };
    }

    private String getBoardTitle(String boardType) {
        return switch (boardType) {
            case "weekly_star" -> "本周星星榜";
            case "streak_master" -> "连续学习榜";
            case "challenge_hero" -> "挑战达人榜";
            default -> "成长排行榜";
        };
    }

    private String metricUnitForBoard(String boardType) {
        return switch (boardType) {
            case "weekly_star" -> "颗星";
            case "streak_master" -> "天";
            case "challenge_hero" -> "次挑战";
            default -> "分";
        };
    }

    private String learningPeriodBucket(int hour) {
        if (hour >= 6 && hour < 9) {
            return "晨间 06:00-09:00";
        }
        if (hour >= 12 && hour < 14) {
            return "午间 12:00-14:00";
        }
        if (hour >= 18 && hour < 20) {
            return "傍晚 18:00-20:00";
        }
        if (hour >= 20 && hour < 22) {
            return "晚间 20:00-22:00";
        }
        return "灵活学习时段";
    }

    private int calculateActiveStreakDays(ChildProfileEntity child) {
        Set<LocalDate> learningDates = getChildCompletions(child).stream()
                .map(item -> item.getCompletedAt().toLocalDate())
                .collect(Collectors.toSet());
        if (learningDates.isEmpty()) {
            return 0;
        }

        LocalDate today = LocalDate.now();
        LocalDate anchorDate;
        if (learningDates.contains(today)) {
            anchorDate = today;
        } else if (learningDates.contains(today.minusDays(1))) {
            anchorDate = today.minusDays(1);
        } else {
            return 0;
        }

        int streakDays = 0;
        while (learningDates.contains(anchorDate.minusDays(streakDays))) {
            streakDays += 1;
        }
        return streakDays;
    }

    private List<LevelCompletionEntity> getEffectiveCompletionsWithinDays(ChildProfileEntity child, int days) {
        LocalDate windowStart = LocalDate.now().minusDays(days - 1L);

        return getChildCompletions(child).stream()
                .collect(Collectors.toMap(
                        item -> item.getLevel().getCode(),
                        Function.identity(),
                        (left, right) -> left.getCompletedAt().isBefore(right.getCompletedAt()) ? left : right,
                        java.util.LinkedHashMap::new
                ))
                .values()
                .stream()
                .filter(item -> !item.getCompletedAt().toLocalDate().isBefore(windowStart))
                .toList();
    }

    private LocalDateTime latestActivityAt(ChildProfileEntity child) {
        return getChildCompletions(child).stream()
                .map(LevelCompletionEntity::getCompletedAt)
                .max(LocalDateTime::compareTo)
                .orElse(LocalDateTime.MIN);
    }

    private record RankedChild(ChildProfileEntity child, int score, String trendLabel, LocalDateTime latestActivityAt) {
    }

    private record SubjectScore(String subjectTitle, double accuracy, String nextLevelTitle) {
    }
}
