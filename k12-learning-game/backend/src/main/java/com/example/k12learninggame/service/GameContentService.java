package com.example.k12learninggame.service;

import com.example.k12learninggame.domain.ChapterEntity;
import com.example.k12learninggame.domain.ChildProfileEntity;
import com.example.k12learninggame.domain.DailyTaskClaimEntity;
import com.example.k12learninggame.domain.FluencyAttemptEntity;
import com.example.k12learninggame.domain.LeaderboardBoardEntity;
import com.example.k12learninggame.domain.LevelCompletionEntity;
import com.example.k12learninggame.domain.LevelEntity;
import com.example.k12learninggame.domain.LevelStepEntity;
import com.example.k12learninggame.domain.MistakeReviewAttemptEntity;
import com.example.k12learninggame.domain.ParentAccountEntity;
import com.example.k12learninggame.domain.SubjectEntity;
import com.example.k12learninggame.dto.AchievementBadgeDto;
import com.example.k12learninggame.dto.AchievementPreviewDto;
import com.example.k12learninggame.dto.AchievementStageFamilyDto;
import com.example.k12learninggame.dto.AchievementSummaryDto;
import com.example.k12learninggame.dto.AchievementsResponse;
import com.example.k12learninggame.dto.AuthLoginRequest;
import com.example.k12learninggame.dto.AuthRegisterRequest;
import com.example.k12learninggame.dto.AuthSessionResponse;
import com.example.k12learninggame.dto.ContentConfigCatalogResponse;
import com.example.k12learninggame.dto.ContentConfigDetailResponse;
import com.example.k12learninggame.dto.ContentConfigItemDto;
import com.example.k12learninggame.dto.ContentConfigUpdateRequest;
import com.example.k12learninggame.dto.ChapterDto;
import com.example.k12learninggame.dto.ChildProfileDto;
import com.example.k12learninggame.dto.ChildProfileUpsertRequest;
import com.example.k12learninggame.dto.CompletionLeaderboardFeedbackDto;
import com.example.k12learninggame.dto.DailyTaskBoardResponse;
import com.example.k12learninggame.dto.DailyTaskClaimResponse;
import com.example.k12learninggame.dto.DailyTaskDto;
import com.example.k12learninggame.dto.CompleteLevelRequest;
import com.example.k12learninggame.dto.CompleteLevelResponse;
import com.example.k12learninggame.dto.FluencyAttemptRequest;
import com.example.k12learninggame.dto.FluencyAttemptResponse;
import com.example.k12learninggame.dto.GoalProgressDto;
import com.example.k12learninggame.dto.HomeOverviewResponse;
import com.example.k12learninggame.dto.LeaderboardRankDto;
import com.example.k12learninggame.dto.LearningPathChapterDto;
import com.example.k12learninggame.dto.LearningPathLevelDto;
import com.example.k12learninggame.dto.LearningPathResponse;
import com.example.k12learninggame.dto.LeaderboardResponse;
import com.example.k12learninggame.dto.LearningVitalsDto;
import com.example.k12learninggame.dto.LevelDetailResponse;
import com.example.k12learninggame.dto.LevelStepDto;
import com.example.k12learninggame.dto.LevelSummaryDto;
import com.example.k12learninggame.dto.KnowledgeMapItemDto;
import com.example.k12learninggame.dto.MistakeReviewCardDto;
import com.example.k12learninggame.dto.MistakeReviewCenterResponse;
import com.example.k12learninggame.dto.MistakeReviewItemDto;
import com.example.k12learninggame.dto.MistakeReviewSubmitRequest;
import com.example.k12learninggame.dto.MistakeReviewSubmitResponse;
import com.example.k12learninggame.dto.ParentChildComparisonDto;
import com.example.k12learninggame.dto.ParentDashboardResponse;
import com.example.k12learninggame.dto.ParentFluencyStageInsightDto;
import com.example.k12learninggame.dto.ParentFluencySummaryDto;
import com.example.k12learninggame.dto.ParentFluencyTrendPointDto;
import com.example.k12learninggame.dto.ParentFluencyTypeInsightDto;
import com.example.k12learninggame.dto.ParentSettingsDto;
import com.example.k12learninggame.dto.ParentActiveChildUpdateRequest;
import com.example.k12learninggame.dto.ParentSettingsUpdateRequest;
import com.example.k12learninggame.dto.ParentSubjectInsightDto;
import com.example.k12learninggame.dto.ParentSubjectProgressDto;
import com.example.k12learninggame.dto.ParentThinkingModelProgressDto;
import com.example.k12learninggame.dto.ParentTodaySummaryDto;
import com.example.k12learninggame.dto.ParentWeakPointActionDto;
import com.example.k12learninggame.dto.ParentWeeklyReportDto;
import com.example.k12learninggame.dto.RecommendedActionDto;
import com.example.k12learninggame.dto.RecentActivityDto;
import com.example.k12learninggame.dto.RewardDto;
import com.example.k12learninggame.dto.SessionChildrenResponse;
import com.example.k12learninggame.dto.StageReportDto;
import com.example.k12learninggame.dto.SubjectCardDto;
import com.example.k12learninggame.dto.SubjectDto;
import com.example.k12learninggame.dto.SubjectMapResponse;
import com.example.k12learninggame.dto.TrendPointDto;
import com.example.k12learninggame.dto.WeakPointDto;
import com.example.k12learninggame.repository.ChildProfileRepository;
import com.example.k12learninggame.repository.DailyTaskClaimRepository;
import com.example.k12learninggame.repository.FluencyAttemptRepository;
import com.example.k12learninggame.repository.LeaderboardBoardRepository;
import com.example.k12learninggame.repository.LevelCompletionRepository;
import com.example.k12learninggame.repository.LevelRepository;
import com.example.k12learninggame.repository.MistakeReviewAttemptRepository;
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
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
@Transactional(readOnly = true)
public class GameContentService {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter WEEK_REPORT_DATE_FORMATTER = DateTimeFormatter.ofPattern("MM月dd日");
    private static final DateTimeFormatter FLUENCY_TREND_DAY_FORMATTER = DateTimeFormatter.ofPattern("M/d");
    private static final List<String> CORE_STAGE_LABELS = List.of("幼小衔接", "一年级", "二年级", "三年级", "四年级");
    private static final String DEFAULT_STAGE_LABEL = "幼小衔接";
    private static final Set<String> MAINLINE_SUBJECT_CODES = Set.of("math", "chinese", "english");
    private static final int FLUENCY_SUMMARY_WINDOW_DAYS = 7;

    private final ChildProfileRepository childProfileRepository;
    private final SubjectRepository subjectRepository;
    private final LevelRepository levelRepository;
    private final LeaderboardBoardRepository leaderboardBoardRepository;
    private final LevelCompletionRepository levelCompletionRepository;
    private final ParentAccountRepository parentAccountRepository;
    private final ParentSettingsRepository parentSettingsRepository;
    private final DailyTaskClaimRepository dailyTaskClaimRepository;
    private final FluencyAttemptRepository fluencyAttemptRepository;
    private final MistakeReviewAttemptRepository mistakeReviewAttemptRepository;

    public GameContentService(
            ChildProfileRepository childProfileRepository,
            SubjectRepository subjectRepository,
            LevelRepository levelRepository,
            LeaderboardBoardRepository leaderboardBoardRepository,
            LevelCompletionRepository levelCompletionRepository,
            ParentAccountRepository parentAccountRepository,
            ParentSettingsRepository parentSettingsRepository,
            DailyTaskClaimRepository dailyTaskClaimRepository,
            FluencyAttemptRepository fluencyAttemptRepository,
            MistakeReviewAttemptRepository mistakeReviewAttemptRepository
    ) {
        this.childProfileRepository = childProfileRepository;
        this.subjectRepository = subjectRepository;
        this.levelRepository = levelRepository;
        this.leaderboardBoardRepository = leaderboardBoardRepository;
        this.levelCompletionRepository = levelCompletionRepository;
        this.parentAccountRepository = parentAccountRepository;
        this.parentSettingsRepository = parentSettingsRepository;
        this.dailyTaskClaimRepository = dailyTaskClaimRepository;
        this.fluencyAttemptRepository = fluencyAttemptRepository;
        this.mistakeReviewAttemptRepository = mistakeReviewAttemptRepository;
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
                getMainlineSubjects().stream()
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
        List<ChapterEntity> relevantChapters = getStageChapters(subject, child);
        Set<String> completedLevelCodes = getCompletedLevelCodesForCurrentStage(child);
        String firstIncompleteCode = findFirstIncompleteLevelCode(relevantChapters, completedLevelCodes);

        return new SubjectMapResponse(
                new SubjectDto(subject.getCode(), subject.getTitle()),
                relevantChapters.stream()
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

    public DailyTaskBoardResponse getDailyTasks(Long childProfileId) {
        ChildProfileEntity child = getChild(childProfileId);
        Set<String> claimedTaskCodes = getClaimedTaskCodes(child, LocalDate.now());
        List<LevelCompletionEntity> completions = getChildCompletions(child);
        List<LevelCompletionEntity> todayCompletions = completions.stream()
                .filter(item -> item.getCompletedAt().toLocalDate().isEqual(LocalDate.now()))
                .toList();
        Set<String> completedLevelCodes = getCompletedLevelCodesForCurrentStage(child);
        LevelEntity nextLevel = findNextIncompleteLevel(child);
        String nextLevelCode = nextLevel != null ? nextLevel.getCode() : null;
        boolean mainLineCompleted = nextLevel == null;
        boolean mainLineTaskCompleted = mainLineCompleted
                || (nextLevelCode != null && todayCompletions.stream().anyMatch(item -> item.getLevel().getCode().equals(nextLevelCode)));

        int todayMistakes = todayCompletions.stream().mapToInt(LevelCompletionEntity::getWrongCount).sum();
        int todayStars = todayCompletions.stream().mapToInt(item -> item.getLevel().getRewardStars()).sum();

        DailyTaskDto mainLineTask = new DailyTaskDto(
                "mainline-next-level",
                "主线下一关",
                nextLevel != null
                        ? "继续挑战“" + nextLevel.getSummaryTitle() + "”，把学习路线往前推进一站。"
                        : "当前学段主线已完成，可以回头巩固一下最喜欢的关卡。",
                "mainline",
                mainLineTaskCompleted,
                mainLineTaskCompleted ? "已推进" : "待推进",
                nextLevelCode,
                nextLevel != null ? "完成后可再得 " + nextLevel.getRewardStars() + " 颗星" : "巩固也有小奖励",
                claimedTaskCodes.contains("mainline-next-level"),
                mainLineTaskCompleted && !claimedTaskCodes.contains("mainline-next-level")
        );

        LevelEntity mostRelevantMistakeLevel = completions.stream()
                .filter(item -> completedLevelCodes.contains(item.getLevel().getCode()))
                .filter(item -> item.getWrongCount() > 0)
                .map(LevelCompletionEntity::getLevel)
                .findFirst()
                .orElse(nextLevel);
        boolean mistakeTaskCompleted = todayMistakes == 0;
        DailyTaskDto mistakeReviewTask = new DailyTaskDto(
                "mistake-review",
                "错题复习",
                todayMistakes > 0
                        ? "今天有 " + todayMistakes + " 道错题，先把它们再过一遍。"
                        : "今天暂时没有新的错题，保持这个状态也很棒。",
                "review",
                mistakeTaskCompleted,
                mistakeTaskCompleted ? "错题已清空" : "建议回顾",
                mostRelevantMistakeLevel != null ? mostRelevantMistakeLevel.getCode() : null,
                mistakeTaskCompleted ? "保持清零，继续前进" : "复习后可再加 1 颗星",
                claimedTaskCodes.contains("mistake-review"),
                mistakeTaskCompleted && !claimedTaskCodes.contains("mistake-review")
        );

        boolean starGoalCompleted = todayStars >= 3;
        DailyTaskDto starGoalTask = new DailyTaskDto(
                "star-goal",
                "成就/星星目标",
                "今天累计拿到 " + todayStars + " 颗星，离今日目标越来越近。",
                "goal",
                starGoalCompleted,
                starGoalCompleted ? "达成目标" : "继续收集",
                nextLevelCode,
                "今日目标星数 " + (starGoalCompleted ? "已达成" : "还差 " + Math.max(0, 3 - todayStars) + " 颗"),
                claimedTaskCodes.contains("star-goal"),
                starGoalCompleted && !claimedTaskCodes.contains("star-goal")
        );

        List<DailyTaskDto> tasks = List.of(mainLineTask, mistakeReviewTask, starGoalTask);
        int completedCount = (int) tasks.stream().filter(DailyTaskDto::completed).count();
        int bonusStars = tasks.stream()
                .filter(DailyTaskDto::completed)
                .mapToInt(task -> switch (task.code()) {
                    case "mainline-next-level" -> nextLevel != null ? nextLevel.getRewardStars() : 1;
                    case "mistake-review" -> 1;
                    case "star-goal" -> 2;
                    default -> 0;
                })
                .sum();

        return new DailyTaskBoardResponse(child.getNickname(), completedCount, tasks.size(), bonusStars, tasks);
    }

    @Transactional
    public DailyTaskClaimResponse claimDailyTask(String taskCode, Long childProfileId) {
        ChildProfileEntity child = getChild(childProfileId);
        LocalDate today = LocalDate.now();
        Optional<DailyTaskClaimEntity> existingClaim = findDailyTaskClaim(child, taskCode, today);
        if (existingClaim.isPresent()) {
            return new DailyTaskClaimResponse(
                    taskCode,
                    false,
                    true,
                    0,
                    child.getTotalStars(),
                    "今天已经领取过这个任务奖励了。",
                    getDailyTasks(child.getId())
            );
        }

        DailyTaskDto task = getDailyTasks(child.getId()).tasks().stream()
                .filter(item -> item.code().equals(taskCode))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Daily task not found"));
        if (!task.completed()) {
            return new DailyTaskClaimResponse(
                    taskCode,
                    false,
                    false,
                    0,
                    child.getTotalStars(),
                    "先完成任务，再回来领取奖励。",
                    getDailyTasks(child.getId())
            );
        }

        int rewardStars = rewardStarsForTask(taskCode);
        child.addStars(rewardStars);
        childProfileRepository.save(child);
        dailyTaskClaimRepository.save(new DailyTaskClaimEntity(child, taskCode, today, rewardStars, LocalDateTime.now()));

        return new DailyTaskClaimResponse(
                taskCode,
                true,
                false,
                rewardStars,
                child.getTotalStars(),
                "奖励已领取，小岛又亮了一点。",
                getDailyTasks(child.getId())
        );
    }

    @Transactional
    public FluencyAttemptResponse recordFluencyAttempt(Long childProfileId, FluencyAttemptRequest request) {
        if (request.correctCount() > request.totalQuestions()) {
            throw new ResponseStatusException(BAD_REQUEST, "correctCount cannot exceed totalQuestions");
        }

        ChildProfileEntity child = getChild(childProfileId);
        int accuracyPercent = (int) Math.round(request.correctCount() * 100.0 / request.totalQuestions());
        LocalDate today = LocalDate.now();
        fluencyAttemptRepository.save(new FluencyAttemptEntity(
                child,
                request.stageLabel(),
                request.focusArea(),
                request.totalQuestions(),
                request.correctCount(),
                request.durationSeconds(),
                accuracyPercent,
                today,
                LocalDateTime.now()
        ));
        long todayAttemptCount = fluencyAttemptRepository.countByChildProfile_IdAndAttemptDate(child.getId(), today);

        return new FluencyAttemptResponse(
                request.stageLabel(),
                request.focusArea(),
                request.totalQuestions(),
                request.correctCount(),
                request.durationSeconds(),
                accuracyPercent,
                todayAttemptCount,
                "今天已完成 " + todayAttemptCount + " 次数感快练，正确率 " + accuracyPercent + "%"
        );
    }

    public MistakeReviewCenterResponse getMistakeReviewCenter(Long childProfileId) {
        ChildProfileEntity child = getChild(childProfileId);
        List<LevelCompletionEntity> completions = getChildCompletions(child);
        Map<String, MistakeReviewAttemptEntity> latestReviewsByLevelCode = getLatestMistakeReviewsByLevelCode(child);
        Set<String> stageLevelCodes = getStageLevelCodes(child);
        Map<String, List<LevelCompletionEntity>> completionsByLevelCode = completions.stream()
                .filter(item -> stageLevelCodes.contains(item.getLevel().getCode()))
                .filter(item -> item.getWrongCount() > 0)
                .filter(item -> !isMasteredByLatestReview(item.getLevel().getCode(), latestReviewsByLevelCode))
                .collect(Collectors.groupingBy(item -> item.getLevel().getCode()));

        List<MistakeReviewCardDto> items = completionsByLevelCode.values().stream()
                .map(this::toMistakeReviewCard)
                .sorted(Comparator
                        .comparingInt(MistakeReviewCardDraft::mistakeCount)
                        .reversed()
                        .thenComparing(MistakeReviewCardDraft::latestCompletedAt, Comparator.reverseOrder()))
                .limit(6)
                .map(draft -> new MistakeReviewCardDto(
                        draft.levelCode(),
                        draft.levelTitle(),
                        draft.subjectTitle(),
                        draft.knowledgePointTitle(),
                        draft.mistakeCount(),
                        draft.masteryStatus(),
                        draft.reviewPrompt(),
                        draft.reviewSteps()
                ))
                .toList();

        int totalMistakes = completionsByLevelCode.values().stream()
                .mapToInt(levelCompletions -> levelCompletions.stream().mapToInt(LevelCompletionEntity::getWrongCount).sum())
                .sum();
        int readyToMasterCount = (int) completionsByLevelCode.values().stream()
                .map(this::toMistakeReviewCard)
                .filter(item -> "接近掌握".equals(item.masteryStatus()))
                .count();

        return new MistakeReviewCenterResponse(child.getNickname(), totalMistakes, readyToMasterCount, items);
    }

    @Transactional
    public MistakeReviewSubmitResponse submitMistakeReview(String levelCode, Long childProfileId, MistakeReviewSubmitRequest request) {
        ChildProfileEntity child = getChild(childProfileId);
        LevelEntity level = levelRepository.findById(levelCode)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Level not found"));
        boolean mastered = request.correctCount() >= 3 && request.wrongCount() == 0;
        String masteryStatus = mastered ? "已掌握" : "继续巩固";
        mistakeReviewAttemptRepository.save(new MistakeReviewAttemptEntity(
                child,
                level,
                request.correctCount(),
                request.wrongCount(),
                request.durationSeconds(),
                mastered,
                masteryStatus,
                LocalDateTime.now()
        ));

        int remainingMistakes = mastered ? 0 : getChildCompletions(child).stream()
                .filter(item -> item.getLevel().getCode().equals(levelCode))
                .mapToInt(LevelCompletionEntity::getWrongCount)
                .sum();

        return new MistakeReviewSubmitResponse(
                levelCode,
                mastered,
                masteryStatus,
                remainingMistakes,
                mastered ? "这个知识点已放入已掌握清单，可以回到主线继续前进。" : "再复习一组同类题，稳定后就能标记掌握。",
                getMistakeReviewCenter(child.getId())
        );
    }

    public LearningPathResponse getLearningPath(Long childProfileId) {
        ChildProfileEntity child = getChild(childProfileId);
        Set<String> completedLevelCodes = getCompletedLevelCodesForCurrentStage(child);
        List<LevelEntity> stageLevels = getAllStageLevels(child);
        String firstIncompleteCode = stageLevels.stream()
                .filter(level -> !completedLevelCodes.contains(level.getCode()))
                .map(LevelEntity::getCode)
                .findFirst()
                .orElse(null);

        List<LearningPathChapterDto> chapters = getMainlineSubjects().stream()
                .flatMap(subject -> getStageChapters(subject, child).stream()
                        .map(chapter -> new LearningPathChapterDto(
                                subject.getCode(),
                                subject.getTitle(),
                                chapter.getTitle(),
                                chapter.getSubtitle(),
                                chapter.getLevels().stream()
                                        .map(level -> toLearningPathLevel(level, completedLevelCodes, firstIncompleteCode))
                                        .toList()
                        )))
                .toList();

        return new LearningPathResponse(
                resolveStageLabel(child),
                (int) completedLevelCodes.size(),
                stageLevels.size(),
                chapters
        );
    }

    public ContentConfigCatalogResponse getContentConfigCatalog() {
        List<ContentConfigItemDto> items = levelRepository.findAll().stream()
                .sorted(Comparator
                        .comparingInt((LevelEntity level) -> level.getChapter().getSubject().getDisplayOrder())
                        .thenComparingInt(level -> level.getChapter().getDisplayOrder())
                        .thenComparing(LevelEntity::getCode))
                .map(this::toContentConfigItem)
                .toList();
        int totalLevelCount = items.size();
        int configuredLevelCount = (int) items.stream()
                .filter(item -> item.configSource().contains("activityConfigJson"))
                .count();
        int healthyLevelCount = (int) items.stream()
                .filter(item -> item.healthStatus().equals("healthy"))
                .count();
        int warningLevelCount = totalLevelCount - healthyLevelCount;
        int configCoveragePercent = totalLevelCount == 0 ? 0 : Math.round(configuredLevelCount * 100f / totalLevelCount);

        return new ContentConfigCatalogResponse(
                totalLevelCount,
                configuredLevelCount,
                healthyLevelCount,
                warningLevelCount,
                configCoveragePercent,
                items.stream().mapToInt(ContentConfigItemDto::variantCount).sum(),
                items
        );
    }

    public ContentConfigDetailResponse getContentConfigDetail(String levelCode) {
        LevelEntity level = levelRepository.findById(levelCode)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Level not found"));

        return toContentConfigDetail(level);
    }

    @Transactional
    public ContentConfigDetailResponse updateContentConfig(String levelCode, ContentConfigUpdateRequest request) {
        LevelEntity level = levelRepository.findById(levelCode)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Level not found"));
        LevelStepEntity configStep = resolveContentConfigStep(level)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Level step not found"));

        configStep.updateContentConfig(
                request.knowledgePointCode().trim(),
                request.knowledgePointTitle().trim(),
                request.variantCount(),
                request.activityConfigJson().trim()
        );

        return toContentConfigDetail(level);
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
        int leaderboardScoreBefore = scoreForBoard("weekly_star", child);
        LocalDateTime latestActivityBefore = latestActivityAt(child);
        Set<String> unlockedBadgeCodesBeforeCompletion = buildAchievements(child).unlockedBadges().stream()
                .map(AchievementBadgeDto::code)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        boolean isFirstCompletion = levelCompletionRepository.findAll().stream()
                .noneMatch(item -> item.getChildProfile().getId().equals(child.getId())
                        && item.getLevel().getCode().equals(levelCode));

        String resultMessage = request.correctCount() == level.getSteps().size() ? "perfect" : "completed";
        LocalDateTime completedAt = LocalDateTime.now();
        levelCompletionRepository.save(new LevelCompletionEntity(
                child,
                level,
                request.correctCount(),
                request.wrongCount(),
                request.durationSeconds(),
                resultMessage,
                completedAt
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
                newlyUnlockedBadges,
                buildCompletionLeaderboardFeedback(
                        child,
                        leaderboardScoreBefore,
                        scoreForBoard("weekly_star", child),
                        latestActivityBefore,
                        completedAt
                )
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
                getCompletedLevelCodesForCurrentStage(child).size(),
                calculateAverageAccuracyPercent(completions),
                subjectProgress.stream()
                        .max(Comparator.comparingInt(ParentSubjectProgressDto::progressPercent))
                        .map(ParentSubjectProgressDto::subjectTitle)
                        .orElse("数学岛"),
                calculateAverageSessionMinutes(completions),
                findBestLearningPeriodLabel(completions),
                countEffectiveLearningDays(child, 7)
        );
        ParentFluencySummaryDto fluencySummary = buildFluencySummary(child);

        return new ParentDashboardResponse(
                child.getNickname(),
                new ParentTodaySummaryDto(
                        todayCompletions.size(),
                        completedMinutes,
                        todayCompletions.stream().mapToInt(item -> item.getLevel().getRewardStars()).sum()
                ),
                buildWeeklyReport(child, completions, fluencySummary),
                subjectProgress,
                buildWeeklyTrend(completions),
                buildWeakPoints(child, completions),
                buildWeakPointActionPlan(child, completions),
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
                fluencySummary,
                buildSubjectInsights(child, completions),
                completions.stream()
                        .limit(3)
                        .map(this::toRecentActivityDto)
                        .toList(),
                buildSiblingComparisons(child),
                buildStageReport(child),
                buildKnowledgeMap(child, completions),
                buildThinkingModelProgress(child),
                buildMistakeReviewPlan(child, completions)
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

    private Optional<DailyTaskClaimEntity> findDailyTaskClaim(ChildProfileEntity child, String taskCode, LocalDate taskDate) {
        return dailyTaskClaimRepository.findAll().stream()
                .filter(item -> item.getChildProfile().getId().equals(child.getId()))
                .filter(item -> item.getTaskCode().equals(taskCode))
                .filter(item -> item.getTaskDate().isEqual(taskDate))
                .findFirst();
    }

    private Set<String> getClaimedTaskCodes(ChildProfileEntity child, LocalDate taskDate) {
        return dailyTaskClaimRepository.findAll().stream()
                .filter(item -> item.getChildProfile().getId().equals(child.getId()))
                .filter(item -> item.getTaskDate().isEqual(taskDate))
                .map(DailyTaskClaimEntity::getTaskCode)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private int rewardStarsForTask(String taskCode) {
        return switch (taskCode) {
            case "mainline-next-level" -> 2;
            case "mistake-review" -> 1;
            case "star-goal" -> 2;
            default -> 0;
        };
    }

    private Map<String, MistakeReviewAttemptEntity> getLatestMistakeReviewsByLevelCode(ChildProfileEntity child) {
        return mistakeReviewAttemptRepository.findAll().stream()
                .filter(item -> item.getChildProfile().getId().equals(child.getId()))
                .collect(Collectors.toMap(
                        item -> item.getLevel().getCode(),
                        Function.identity(),
                        (left, right) -> left.getReviewedAt().isAfter(right.getReviewedAt()) ? left : right
                ));
    }

    private boolean isMasteredByLatestReview(String levelCode, Map<String, MistakeReviewAttemptEntity> latestReviewsByLevelCode) {
        return Optional.ofNullable(latestReviewsByLevelCode.get(levelCode))
                .map(MistakeReviewAttemptEntity::isMastered)
                .orElse(false);
    }

    private Set<String> getCompletedLevelCodes(ChildProfileEntity child) {
        return getChildCompletions(child).stream()
                .map(item -> item.getLevel().getCode())
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private ParentFluencySummaryDto buildFluencySummary(ChildProfileEntity child) {
        List<FluencyAttemptEntity> childAttempts = fluencyAttemptRepository.findByChildProfile_IdOrderByRecordedAtDesc(child.getId());
        LocalDate windowStart = LocalDate.now().minusDays(FLUENCY_SUMMARY_WINDOW_DAYS - 1L);
        List<FluencyAttemptEntity> recentAttempts = childAttempts.stream()
                .filter(item -> !item.getAttemptDate().isBefore(windowStart))
                .toList();

        FluencyAttemptEntity latestAttempt = childAttempts.stream().findFirst().orElse(null);
        int averageAccuracyPercent = recentAttempts.isEmpty()
                ? 0
                : (int) Math.round(recentAttempts.stream()
                .mapToInt(FluencyAttemptEntity::getAccuracyPercent)
                .average()
                .orElse(0));

        return new ParentFluencySummaryDto(
                recentAttempts.size(),
                averageAccuracyPercent,
                latestAttempt != null ? latestAttempt.getStageLabel() : resolveStageLabel(child),
                latestAttempt != null ? latestAttempt.getAccuracyPercent() : 0,
                latestAttempt != null ? toRelativeDateTimeLabel(latestAttempt.getRecordedAt()) : "",
                buildFluencyEncouragement(recentAttempts.size()),
                buildFluencyTrend(recentAttempts, windowStart),
                buildFluencyStageInsights(recentAttempts),
                buildFluencyTypeInsights(recentAttempts)
        );
    }

    private List<ParentFluencyTrendPointDto> buildFluencyTrend(
            List<FluencyAttemptEntity> recentAttempts,
            LocalDate windowStart
    ) {
        Map<LocalDate, List<FluencyAttemptEntity>> attemptsByDate = recentAttempts.stream()
                .collect(Collectors.groupingBy(FluencyAttemptEntity::getAttemptDate));

        return windowStart.datesUntil(windowStart.plusDays(FLUENCY_SUMMARY_WINDOW_DAYS))
                .map(date -> {
                    List<FluencyAttemptEntity> attempts = attemptsByDate.getOrDefault(date, List.of());
                    int averageAccuracyPercent = attempts.isEmpty()
                            ? 0
                            : (int) Math.round(attempts.stream()
                            .mapToInt(FluencyAttemptEntity::getAccuracyPercent)
                            .average()
                            .orElse(0));
                    return new ParentFluencyTrendPointDto(
                            date.format(FLUENCY_TREND_DAY_FORMATTER),
                            attempts.size(),
                            averageAccuracyPercent
                    );
                })
                .toList();
    }

    private String buildFluencyEncouragement(int attemptCount) {
        if (attemptCount == 0) {
            return "本周还没有开始数感快练，可以先用 1 分钟热热身。";
        }
        return "本周已经完成 " + attemptCount + " 次快练，可以继续保持每天 1 次的节奏。";
    }

    private List<ParentFluencyStageInsightDto> buildFluencyStageInsights(List<FluencyAttemptEntity> recentAttempts) {
        return recentAttempts.stream()
                .collect(Collectors.groupingBy(
                        FluencyAttemptEntity::getStageLabel,
                        LinkedHashMap::new,
                        Collectors.toList()
                ))
                .entrySet().stream()
                .map(entry -> {
                    int averageAccuracyPercent = (int) Math.round(entry.getValue().stream()
                            .mapToInt(FluencyAttemptEntity::getAccuracyPercent)
                            .average()
                            .orElse(0));
                    String statusLabel = fluencyStageStatusLabel(averageAccuracyPercent);

                    return new ParentFluencyStageInsightDto(
                            entry.getKey(),
                            entry.getValue().size(),
                            averageAccuracyPercent,
                            statusLabel,
                            fluencyStageRecommendation(entry.getKey(), statusLabel)
                    );
                })
                .sorted(Comparator.comparingInt(item -> stageOrder(item.stageLabel())))
                .toList();
    }

    private List<ParentFluencyTypeInsightDto> buildFluencyTypeInsights(List<FluencyAttemptEntity> recentAttempts) {
        return recentAttempts.stream()
                .collect(Collectors.groupingBy(
                        FluencyAttemptEntity::getFocusArea,
                        LinkedHashMap::new,
                        Collectors.toList()
                ))
                .entrySet().stream()
                .map(entry -> {
                    int averageAccuracyPercent = (int) Math.round(entry.getValue().stream()
                            .mapToInt(FluencyAttemptEntity::getAccuracyPercent)
                            .average()
                            .orElse(0));
                    String statusLabel = fluencyStageStatusLabel(averageAccuracyPercent);

                    return new ParentFluencyTypeInsightDto(
                            entry.getKey(),
                            fluencyFocusAreaLabel(entry.getKey()),
                            entry.getValue().size(),
                            averageAccuracyPercent,
                            statusLabel,
                            fluencyTypeRecommendation(entry.getKey(), statusLabel)
                    );
                })
                .sorted(Comparator
                        .comparingInt((ParentFluencyTypeInsightDto item) -> fluencyFocusAreaPriority(item.focusArea()))
                        .thenComparing(ParentFluencyTypeInsightDto::focusAreaLabel))
                .toList();
    }

    private String fluencyStageStatusLabel(int averageAccuracyPercent) {
        if (averageAccuracyPercent >= 90) {
            return "稳定发挥";
        }
        if (averageAccuracyPercent >= 75) {
            return "继续巩固";
        }
        return "建议回看";
    }

    private String fluencyStageRecommendation(String stageLabel, String statusLabel) {
        return switch (statusLabel) {
            case "稳定发挥" -> "可以继续保持" + stageLabel + "快练节奏，准备挑战更高一层。";
            case "继续巩固" -> "建议继续完成" + stageLabel + "快练，先把正确率稳在 90% 左右。";
            default -> "建议先回到" + stageLabel + "做慢练，边说思路边完成 1 组。";
        };
    }

    private String fluencyFocusAreaLabel(String focusArea) {
        return switch (focusArea) {
            case "number-sense" -> "数感启蒙";
            case "addition-within-20" -> "20 以内加减";
            case "multiplication-division" -> "乘除数感";
            case "multi-step-arithmetic" -> "多步运算";
            case "decimal-number-sense" -> "小数数感";
            default -> "数感快练";
        };
    }

    private String fluencyTypeRecommendation(String focusArea, String statusLabel) {
        String focusAreaLabel = fluencyFocusAreaLabel(focusArea);
        return switch (statusLabel) {
            case "稳定发挥" -> focusAreaLabel + "已经很稳，可以继续保持轻快节奏。";
            case "继续巩固" -> "建议今晚先用" + focusAreaLabel + "做慢练，再进入下一组快练。";
            default -> "建议先回看" + focusAreaLabel + "，用实物图或数轴把思路说出来。";
        };
    }

    private int fluencyFocusAreaPriority(String focusArea) {
        return switch (focusArea) {
            case "number-sense" -> 0;
            case "addition-within-20" -> 1;
            case "multiplication-division" -> 2;
            case "multi-step-arithmetic" -> 3;
            case "decimal-number-sense" -> 4;
            default -> 9;
        };
    }

    private int stageOrder(String stageLabel) {
        int index = CORE_STAGE_LABELS.indexOf(stageLabel);
        return index >= 0 ? index : CORE_STAGE_LABELS.size();
    }

    private String resolveStageLabel(ChildProfileEntity child) {
        return Optional.ofNullable(child.getStageLabel())
                .filter(label -> !label.isBlank())
                .orElse(DEFAULT_STAGE_LABEL);
    }

    private List<SubjectEntity> getMainlineSubjects() {
        return subjectRepository.findAllByOrderByDisplayOrderAsc().stream()
                .filter(subject -> MAINLINE_SUBJECT_CODES.contains(subject.getCode()))
                .toList();
    }

    private List<ChapterEntity> getStageChapters(SubjectEntity subject, ChildProfileEntity child) {
        return getStageChapters(subject, resolveStageLabel(child));
    }

    private List<ChapterEntity> getStageChapters(SubjectEntity subject, String stageLabel) {
        return subject.getChapters().stream()
                .filter(chapter -> stageLabel.equals(resolveStageLabel(chapter)))
                .toList();
    }

    private List<LevelEntity> getStageLevels(SubjectEntity subject, ChildProfileEntity child) {
        return getStageChapters(subject, child).stream()
                .flatMap(chapter -> chapter.getLevels().stream())
                .toList();
    }

    private List<LevelEntity> getStageLevels(SubjectEntity subject, String stageLabel) {
        return getStageChapters(subject, stageLabel).stream()
                .flatMap(chapter -> chapter.getLevels().stream())
                .toList();
    }

    private Set<String> getStageLevelCodes(ChildProfileEntity child) {
        return getAllStageLevels(child).stream()
                .map(LevelEntity::getCode)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private List<LevelEntity> getAllStageLevels(ChildProfileEntity child) {
        return getMainlineSubjects().stream()
                .flatMap(subject -> getStageLevels(subject, child).stream())
                .toList();
    }

    private Set<String> getCompletedLevelCodesForCurrentStage(ChildProfileEntity child) {
        Set<String> stageLevelCodes = getStageLevelCodes(child);

        return getCompletedLevelCodes(child).stream()
                .filter(stageLevelCodes::contains)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private LevelEntity findNextIncompleteLevel(ChildProfileEntity child) {
        Set<String> completedLevelCodes = getCompletedLevelCodesForCurrentStage(child);

        return getMainlineSubjects().stream()
                .flatMap(subject -> getStageLevels(subject, child).stream())
                .filter(level -> !completedLevelCodes.contains(level.getCode()))
                .findFirst()
                .orElse(null);
    }

    private String findFirstIncompleteLevelCode(List<ChapterEntity> chapters, Set<String> completedLevelCodes) {
        return chapters.stream()
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

        return "locked";
    }

    private List<ParentSubjectProgressDto> buildSubjectProgress(ChildProfileEntity child) {
        Set<String> completedLevelCodes = getCompletedLevelCodesForCurrentStage(child);

        return getMainlineSubjects().stream()
                .map(subject -> {
                    List<LevelEntity> stageLevels = getStageLevels(subject, child);
                    long totalLevels = stageLevels.size();
                    long completedLevels = stageLevels.stream()
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
        Set<String> completedLevelCodes = getCompletedLevelCodesForCurrentStage(child);

        return getMainlineSubjects().stream()
                .map(subject -> {
                    List<LevelEntity> subjectLevels = getStageLevels(subject, child);
                    Set<String> subjectLevelCodes = subjectLevels.stream()
                            .map(LevelEntity::getCode)
                            .collect(LinkedHashSet::new, Set::add, Set::addAll);
                    List<LevelCompletionEntity> subjectCompletions = completions.stream()
                            .filter(item -> subjectLevelCodes.contains(item.getLevel().getCode()))
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

    private List<ParentChildComparisonDto> buildSiblingComparisons(ChildProfileEntity activeChild) {
        Long parentAccountId = activeChild.getParentAccount().getId();

        return childProfileRepository.findAllByOrderByIdAsc().stream()
                .filter(profile -> profile.getParentAccount().getId().equals(parentAccountId))
                .map(profile -> {
                    List<LevelCompletionEntity> completions = getChildCompletions(profile);
                    int weeklyStars = scoreForBoard("weekly_star", profile);
                    int completedLevels = getCompletedLevelCodesForCurrentStage(profile).size();
                    int averageAccuracyPercent = calculateAverageAccuracyPercent(completions);
                    boolean active = profile.getId().equals(activeChild.getId());

                    return new ParentChildComparisonDto(
                            profile.getNickname(),
                            resolveStageLabel(profile),
                            completedLevels,
                            weeklyStars,
                            averageAccuracyPercent,
                            active,
                            buildSiblingStatusLabel(active, weeklyStars, completedLevels, averageAccuracyPercent)
                    );
                })
                .sorted(Comparator
                        .comparing(ParentChildComparisonDto::activeChild)
                        .reversed()
                        .thenComparing(ParentChildComparisonDto::weeklyStars, Comparator.reverseOrder())
                        .thenComparing(ParentChildComparisonDto::completedLevels, Comparator.reverseOrder()))
                .toList();
    }

    private String buildSiblingStatusLabel(
            boolean active,
            int weeklyStars,
            int completedLevels,
            int averageAccuracyPercent
    ) {
        if (active) {
            return "当前查看";
        }
        if (weeklyStars >= 10) {
            return "本周星星更多";
        }
        if (averageAccuracyPercent >= 90) {
            return "准确率很稳";
        }
        if (completedLevels == 0) {
            return "等待开启学习";
        }
        return "保持自己的节奏";
    }

    private StageReportDto buildStageReport(ChildProfileEntity child) {
        List<LevelEntity> stageLevels = getAllStageLevels(child);
        Set<String> completedLevelCodes = getCompletedLevelCodesForCurrentStage(child);
        int completedLevels = (int) stageLevels.stream()
                .map(LevelEntity::getCode)
                .filter(completedLevelCodes::contains)
                .count();
        int totalLevels = stageLevels.size();
        int completionPercent = totalLevels == 0 ? 0 : (int) Math.round(completedLevels * 100.0 / totalLevels);
        String nextMilestone = stageLevels.stream()
                .filter(level -> !completedLevelCodes.contains(level.getCode()))
                .map(level -> "下一阶段建议完成“" + level.getSummaryTitle() + "”。")
                .findFirst()
                .orElse("本阶段主线已完成，可以进入综合复习或下一学段预习。");

        return new StageReportDto(
                resolveStageLabel(child),
                completedLevels,
                totalLevels,
                completionPercent,
                readinessLabel(completionPercent),
                nextMilestone
        );
    }

    private ParentWeeklyReportDto buildWeeklyReport(
            ChildProfileEntity child,
            List<LevelCompletionEntity> completions,
            ParentFluencySummaryDto fluencySummary
    ) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);
        List<LevelCompletionEntity> weeklyCompletions = completions.stream()
                .filter(item -> !item.getCompletedAt().toLocalDate().isBefore(startDate))
                .filter(item -> !item.getCompletedAt().toLocalDate().isAfter(endDate))
                .toList();
        List<ParentSubjectInsightDto> subjectInsights = buildSubjectInsights(child, weeklyCompletions);
        ParentSubjectInsightDto strongestSubject = subjectInsights.stream()
                .max(Comparator.comparingInt(ParentSubjectInsightDto::completedLevels)
                        .thenComparingInt(ParentSubjectInsightDto::accuracyPercent))
                .orElse(null);
        List<WeakPointDto> weakPoints = buildWeakPoints(child, weeklyCompletions);

        int completedLevels = weeklyCompletions.size();
        int studyMinutes = toRoundedMinutes(weeklyCompletions);
        int earnedStars = weeklyCompletions.stream().mapToInt(item -> item.getLevel().getRewardStars()).sum();
        int averageAccuracyPercent = calculateAverageAccuracyPercent(weeklyCompletions);
        String dateRangeLabel = startDate.format(WEEK_REPORT_DATE_FORMATTER) + "-" + endDate.format(WEEK_REPORT_DATE_FORMATTER);
        String highlightText = strongestSubject == null
                ? "本周还在积累学习数据，先保持轻松开始。"
                : strongestSubject.subjectTitle() + "推进最明显，已完成 " + strongestSubject.completedLevels() + " 关，准确率 " + strongestSubject.accuracyPercent() + "%。";
        ParentFluencyTypeInsightDto weakestFluencyType = fluencySummary.typeInsights().stream()
                .sorted(Comparator
                        .comparingInt(ParentFluencyTypeInsightDto::averageAccuracyPercent)
                        .thenComparing(Comparator.comparingInt(ParentFluencyTypeInsightDto::attemptCount).reversed()))
                .findFirst()
                .orElse(null);
        String growthFocus = weakPoints.isEmpty()
                ? weakestFluencyType != null && weakestFluencyType.averageAccuracyPercent() < 90
                ? "下周重点：先把数感快练里的" + weakestFluencyType.focusAreaLabel() + "稳住。"
                : "下周重点：保持当前节奏，继续点亮主线下一关。"
                : "下周重点：" + weakPoints.get(0).title() + "。";
        String parentAction = "建议每天 " + Math.max(10, Math.min(25, studyMinutes / Math.max(countEffectiveLearningDays(child, 7), 1) + 10))
                + " 分钟，先复习错题再挑战下一关。";
        if (weakestFluencyType != null && weakestFluencyType.averageAccuracyPercent() < 90) {
            parentAction = parentAction + " 今晚可以先做 1 组" + weakestFluencyType.focusAreaLabel() + "慢练。";
        }

        List<String> subjectHighlights = new ArrayList<>(subjectInsights.stream()
                .map(item -> item.subjectTitle() + "：完成 " + item.completedLevels() + " 关，准确率 " + item.accuracyPercent() + "%")
                .toList());
        if (weakestFluencyType != null) {
            subjectHighlights.add(fluencyWeeklyHighlight(weakestFluencyType));
        }

        return new ParentWeeklyReportDto(
                child.getNickname() + "的本周成长周报",
                dateRangeLabel,
                "本周完成 " + completedLevels + " 关，学习 " + studyMinutes + " 分钟，收集 " + earnedStars + " 颗星星。",
                highlightText,
                growthFocus,
                parentAction,
                completedLevels,
                studyMinutes,
                earnedStars,
                averageAccuracyPercent,
                countEffectiveLearningDays(child, 7),
                subjectHighlights
        );
    }

    private String fluencyWeeklyHighlight(ParentFluencyTypeInsightDto weakestFluencyType) {
        if (weakestFluencyType.averageAccuracyPercent() >= 90) {
            return "数感快练：" + weakestFluencyType.focusAreaLabel() + "表现稳定，可以继续保持每天 1 次节奏";
        }
        return "数感快练：" + weakestFluencyType.focusAreaLabel() + "仍需巩固，建议今晚先做 1 组慢练";
    }

    private List<KnowledgeMapItemDto> buildKnowledgeMap(ChildProfileEntity child, List<LevelCompletionEntity> completions) {
        Set<String> stageLevelCodes = getStageLevelCodes(child);
        Map<String, List<LevelCompletionEntity>> completionsByLevelCode = completions.stream()
                .filter(item -> stageLevelCodes.contains(item.getLevel().getCode()))
                .collect(Collectors.groupingBy(item -> item.getLevel().getCode()));

        return getAllStageLevels(child).stream()
                .flatMap(level -> knowledgePointsForLevel(level).stream()
                        .map(knowledgePoint -> toKnowledgeMapItem(level, knowledgePoint, completionsByLevelCode.getOrDefault(level.getCode(), List.of()))))
                .toList();
    }

    private List<MistakeReviewItemDto> buildMistakeReviewPlan(ChildProfileEntity child, List<LevelCompletionEntity> completions) {
        Set<String> stageLevelCodes = getStageLevelCodes(child);

        return completions.stream()
                .filter(item -> stageLevelCodes.contains(item.getLevel().getCode()))
                .filter(item -> item.getWrongCount() > 0)
                .collect(Collectors.groupingBy(item -> item.getLevel().getCode()))
                .values()
                .stream()
                .map(this::toMistakeReviewItem)
                .sorted(Comparator
                        .comparingInt(MistakeReviewDraft::mistakeCount)
                        .reversed()
                        .thenComparing(MistakeReviewDraft::latestCompletedAt, Comparator.reverseOrder()))
                .limit(5)
                .map(draft -> new MistakeReviewItemDto(
                        draft.levelTitle(),
                        draft.knowledgePointTitle(),
                        draft.mistakeCount(),
                        draft.reviewAction(),
                        draft.targetLevelCode()
                ))
                .toList();
    }

    private List<ParentWeakPointActionDto> buildWeakPointActionPlan(ChildProfileEntity child, List<LevelCompletionEntity> completions) {
        return buildMistakeReviewPlan(child, completions).stream()
                .limit(3)
                .map(item -> {
                    LevelEntity level = levelRepository.findById(item.targetLevelCode()).orElse(null);
                    String subjectTitle = level == null ? "学习小岛" : level.getChapter().getSubject().getTitle();

                    return new ParentWeakPointActionDto(
                            subjectTitle,
                            item.knowledgePointTitle(),
                            "优先陪练",
                            "错题 " + item.mistakeCount() + " 次，建议先用孩子能看见、能说出的方式复盘。",
                            buildParentGuidance(subjectTitle, item.knowledgePointTitle()),
                            item.reviewAction(),
                            item.targetLevelCode()
                    );
                })
                .toList();
    }

    private String buildParentGuidance(String subjectTitle, String knowledgePointTitle) {
        if ("数学岛".equals(subjectTitle)) {
            return "陪孩子用积木、苹果或手指摆一摆“" + knowledgePointTitle + "”，边移动边说出算式和理由。";
        }

        if ("语文岛".equals(subjectTitle)) {
            return "陪孩子先读一遍“" + knowledgePointTitle + "”，再让孩子指着关键字说出自己的判断。";
        }

        if ("英语岛".equals(subjectTitle)) {
            return "陪孩子听 1 遍“" + knowledgePointTitle + "”，再用轻声跟读和角色扮演完成一次复述。";
        }

        return "陪孩子先讲清“" + knowledgePointTitle + "”哪里卡住，再完成一组短练习。";
    }

    private List<ParentThinkingModelProgressDto> buildThinkingModelProgress(ChildProfileEntity child) {
        Set<String> completedLevelCodes = getCompletedLevelCodesForCurrentStage(child);
        Map<String, ThinkingModelAccumulator> accumulators = new LinkedHashMap<>();

        for (LevelEntity level : getAllStageLevels(child)) {
            for (ThinkingModelDefinition definition : resolveThinkingModelsForLevel(level)) {
                ThinkingModelAccumulator accumulator = accumulators.computeIfAbsent(
                        definition.modelCode(),
                        ignored -> new ThinkingModelAccumulator(definition)
                );
                accumulator.totalLevelCodes().add(level.getCode());
                if (completedLevelCodes.contains(level.getCode())) {
                    accumulator.completedLevelCodes().add(level.getCode());
                }
            }
        }

        return accumulators.values().stream()
                .map(accumulator -> {
                    int totalLevels = accumulator.totalLevelCodes().size();
                    int completedLevels = accumulator.completedLevelCodes().size();
                    int progressPercent = totalLevels == 0 ? 0 : Math.min((completedLevels * 100) / totalLevels, 100);
                    ThinkingModelDefinition definition = accumulator.definition();

                    return new ParentThinkingModelProgressDto(
                            definition.modelCode(),
                            definition.modelTitle(),
                            definition.modelTypeLabel(),
                            completedLevels,
                            totalLevels,
                            progressPercent,
                            buildThinkingModelNextAction(definition, completedLevels, totalLevels)
                    );
                })
                .toList();
    }

    private List<ThinkingModelDefinition> resolveThinkingModelsForLevel(LevelEntity level) {
        String signal = (level.getCode() + " " + level.getSummaryTitle() + " " + level.getDetailTitle() + " " + level.getDescription() + " "
                + level.getSteps().stream()
                .map(step -> String.join(" ",
                        Optional.ofNullable(step.getKnowledgePointCode()).orElse(""),
                        Optional.ofNullable(step.getKnowledgePointTitle()).orElse(""),
                        Optional.ofNullable(step.getActivityConfigJson()).orElse("")
                ))
                .collect(Collectors.joining(" "))).toLowerCase();
        List<ThinkingModelDefinition> definitions = new ArrayList<>();

        if (signal.contains("array") || signal.contains("数组")) {
            definitions.add(new ThinkingModelDefinition("array-model", "数组模型", "乘法结构"));
        }
        if (signal.contains("bar-model") || signal.contains("线段图")) {
            definitions.add(new ThinkingModelDefinition("bar-model", "线段图模型", "数量关系"));
        }
        if (signal.contains("area-model") || signal.contains("面积模型")) {
            definitions.add(new ThinkingModelDefinition("area-model", "面积模型", "图形运算"));
        }
        if (signal.contains("fraction-bar") || signal.contains("fraction-bars") || signal.contains("分数条")) {
            definitions.add(new ThinkingModelDefinition("fraction-bar", "分数条模型", "分数理解"));
        }
        if (signal.contains("number-line") || signal.contains("数轴")) {
            definitions.add(new ThinkingModelDefinition("number-line", "数轴模型", "数感迁移"));
        }
        if (signal.contains("hundred-chart") || signal.contains("hundredths-grid") || signal.contains("百格图") || signal.contains("百分位")) {
            definitions.add(new ThinkingModelDefinition("grid-model", "百格图模型", "位值观察"));
        }

        return definitions;
    }

    private String buildThinkingModelNextAction(ThinkingModelDefinition definition, int completedLevels, int totalLevels) {
        if (completedLevels >= totalLevels && totalLevels > 0) {
            return "这个模型已经走完当前阶段，可以尝试让孩子自己讲一遍解题过程。";
        }
        if (completedLevels > 0) {
            return "继续用“" + definition.modelTitle() + "”说清题目关系，把模型画出来再作答。";
        }

        return "先挑战 1 个“" + definition.modelTitle() + "”关卡，让孩子看见题目背后的结构。";
    }

    private List<KnowledgePointDraft> knowledgePointsForLevel(LevelEntity level) {
        if (level.getSteps().isEmpty()) {
            return List.of(new KnowledgePointDraft(
                    level.getCode() + ".core",
                    level.getSummaryTitle(),
                    1
            ));
        }

        return level.getSteps().stream()
                .map(step -> new KnowledgePointDraft(
                        Optional.ofNullable(step.getKnowledgePointCode()).filter(value -> !value.isBlank()).orElse(level.getCode() + "." + step.getStepCode()),
                        Optional.ofNullable(step.getKnowledgePointTitle()).filter(value -> !value.isBlank()).orElse(level.getSummaryTitle()),
                        Optional.ofNullable(step.getVariantCount()).orElse(1)
                ))
                .toList();
    }

    private KnowledgeMapItemDto toKnowledgeMapItem(
            LevelEntity level,
            KnowledgePointDraft knowledgePoint,
            List<LevelCompletionEntity> levelCompletions
    ) {
        int totalAttempts = levelCompletions.stream()
                .mapToInt(item -> item.getCorrectCount() + item.getWrongCount())
                .sum();
        int totalCorrect = levelCompletions.stream()
                .mapToInt(LevelCompletionEntity::getCorrectCount)
                .sum();
        int masteryPercent = totalAttempts == 0 ? 0 : (int) Math.round(totalCorrect * 100.0 / totalAttempts);
        String statusLabel = knowledgeStatusLabel(totalAttempts, masteryPercent);
        String nextAction = switch (statusLabel) {
            case "已掌握" -> "保持节奏，进入下一关或尝试更高星挑战。";
            case "继续巩固" -> "再练 1 组“" + level.getSummaryTitle() + "”变式题，争取稳定到 85%。";
            case "需要复习" -> "复习“" + level.getSummaryTitle() + "”，优先讲清错因后再做变式。";
            default -> "开始挑战“" + level.getSummaryTitle() + "”，建立这个知识点的第一条记录。";
        };

        return new KnowledgeMapItemDto(
                level.getChapter().getSubject().getTitle(),
                knowledgePoint.code(),
                knowledgePoint.title(),
                masteryPercent,
                statusLabel,
                nextAction
        );
    }

    private MistakeReviewCardDraft toMistakeReviewCard(List<LevelCompletionEntity> levelCompletions) {
        LevelEntity level = levelCompletions.get(0).getLevel();
        String subjectTitle = level.getChapter().getSubject().getTitle();
        String knowledgePointTitle = knowledgePointsForLevel(level).stream()
                .findFirst()
                .map(KnowledgePointDraft::title)
                .orElse(level.getSummaryTitle());
        int mistakeCount = levelCompletions.stream().mapToInt(LevelCompletionEntity::getWrongCount).sum();
        LocalDateTime latestCompletedAt = levelCompletions.stream()
                .map(LevelCompletionEntity::getCompletedAt)
                .max(LocalDateTime::compareTo)
                .orElse(LocalDateTime.MIN);
        String masteryStatus = mistakeCount <= 2 ? "接近掌握" : "需要复习";

        return new MistakeReviewCardDraft(
                level.getCode(),
                level.getDetailTitle(),
                subjectTitle,
                knowledgePointTitle,
                mistakeCount,
                masteryStatus,
                "先回看“" + knowledgePointTitle + "”的关键点，再把同类题完整做一遍。",
                List.of(
                        "先圈出错因，确认是读题、计算还是概念问题。",
                        "重看“" + knowledgePointTitle + "”并做一次口头复述。",
                        "完成 1 组同类变式，检验是否真正掌握。"
                ),
                latestCompletedAt
        );
    }

    private LearningPathLevelDto toLearningPathLevel(LevelEntity level, Set<String> completedLevelCodes, String firstIncompleteCode) {
        String status = resolveLevelStatus(level.getCode(), completedLevelCodes, firstIncompleteCode);
        boolean locked = "locked".equals(status);
        return new LearningPathLevelDto(
                level.getCode(),
                level.getSummaryTitle(),
                status,
                locked,
                locked ? "先完成前一站，再解锁这里" : null
        );
    }

    private ContentConfigItemDto toContentConfigItem(LevelEntity level) {
        ContentConfigSnapshot snapshot = buildContentConfigSnapshot(level);

        return new ContentConfigItemDto(
                level.getCode(),
                resolveContentConfigLevelTitle(level),
                level.getChapter().getSubject().getTitle(),
                snapshot.knowledgePointCode(),
                snapshot.knowledgePointTitle(),
                snapshot.variantCount(),
                snapshot.assetTheme(),
                snapshot.audioQuality(),
                snapshot.configSource(),
                snapshot.healthStatus(),
                snapshot.healthNotes()
        );
    }

    private ContentConfigDetailResponse toContentConfigDetail(LevelEntity level) {
        ContentConfigSnapshot snapshot = buildContentConfigSnapshot(level);
        LevelStepEntity configStep = snapshot.step();

        return new ContentConfigDetailResponse(
                level.getCode(),
                resolveContentConfigLevelTitle(level),
                level.getChapter().getSubject().getTitle(),
                configStep == null ? "step-1" : configStep.getStepCode(),
                configStep == null ? level.getSummaryTitle() : configStep.getPrompt(),
                snapshot.knowledgePointCode(),
                snapshot.knowledgePointTitle(),
                snapshot.variantCount(),
                snapshot.activityConfigJson(),
                snapshot.assetTheme(),
                snapshot.audioQuality(),
                snapshot.configSource(),
                snapshot.healthStatus(),
                snapshot.healthNotes()
        );
    }

    private ContentConfigSnapshot buildContentConfigSnapshot(LevelEntity level) {
        LevelStepEntity configStep = resolveContentConfigStep(level).orElse(null);
        String activityConfigJson = configStep == null ? null : configStep.getActivityConfigJson();
        String assetTheme = Optional.ofNullable(extractJsonStringValue(activityConfigJson, "assetTheme"))
                .filter(value -> !value.isBlank())
                .orElse("待补素材主题");
        String audioQuality = Optional.ofNullable(extractJsonStringValue(activityConfigJson, "audioQuality"))
                .filter(value -> !value.isBlank())
                .orElse("待补音频质量");
        String configSource = buildConfigSource(configStep, assetTheme, audioQuality);
        int variantCount = configStep == null ? 0 : Optional.ofNullable(configStep.getVariantCount()).orElse(0);
        List<String> healthNotes = buildConfigHealthNotes(configStep, assetTheme, audioQuality, variantCount);
        String healthStatus = healthNotes.isEmpty() ? "healthy" : "warning";
        String knowledgePointCode = configStep == null
                ? level.getCode() + ".step-1"
                : Optional.ofNullable(configStep.getKnowledgePointCode()).orElse(level.getCode() + "." + configStep.getStepCode());
        String knowledgePointTitle = configStep == null
                ? level.getSummaryTitle()
                : Optional.ofNullable(configStep.getKnowledgePointTitle()).orElse(level.getSummaryTitle());

        return new ContentConfigSnapshot(
                configStep,
                activityConfigJson == null ? "" : activityConfigJson,
                knowledgePointCode,
                knowledgePointTitle,
                variantCount,
                assetTheme,
                audioQuality,
                configSource,
                healthStatus,
                healthNotes.isEmpty() ? List.of("配置完整") : healthNotes
        );
    }

    private Optional<LevelStepEntity> resolveContentConfigStep(LevelEntity level) {
        return level.getSteps().stream()
                .sorted(Comparator.comparingInt(LevelStepEntity::getDisplayOrder))
                .filter(this::hasConfigSignal)
                .findFirst()
                .or(() -> level.getSteps().stream()
                        .sorted(Comparator.comparingInt(LevelStepEntity::getDisplayOrder))
                        .findFirst());
    }

    private String resolveContentConfigLevelTitle(LevelEntity level) {
        return Optional.ofNullable(level.getDetailTitle())
                .filter(value -> !value.isBlank())
                .orElse(level.getSummaryTitle());
    }

    private boolean hasConfigSignal(LevelStepEntity step) {
        return (step.getActivityConfigJson() != null && !step.getActivityConfigJson().isBlank())
                || (step.getKnowledgePointCode() != null && !step.getKnowledgePointCode().isBlank())
                || (step.getKnowledgePointTitle() != null && !step.getKnowledgePointTitle().isBlank())
                || step.getVariantCount() != null;
    }

    private String buildConfigSource(LevelStepEntity step, String assetTheme, String audioQuality) {
        if (step == null) {
            return "none";
        }
        boolean hasJson = step.getActivityConfigJson() != null && !step.getActivityConfigJson().isBlank();
        boolean hasKnowledge = (step.getKnowledgePointCode() != null && !step.getKnowledgePointCode().isBlank())
                || (step.getKnowledgePointTitle() != null && !step.getKnowledgePointTitle().isBlank())
                || step.getVariantCount() != null;

        if (hasJson && hasKnowledge) {
            return "activityConfigJson+knowledge";
        }
        if (hasJson) {
            return "activityConfigJson";
        }
        if (hasKnowledge) {
            return "knowledge";
        }

        return "unknown";
    }

    private List<String> buildConfigHealthNotes(LevelStepEntity step, String assetTheme, String audioQuality, int variantCount) {
        java.util.ArrayList<String> notes = new java.util.ArrayList<>();
        if (step == null) {
            notes.add("缺少关卡步骤");
            return notes;
        }

        if (step.getActivityConfigJson() == null || step.getActivityConfigJson().isBlank()) {
            notes.add("缺少后端玩法配置");
        }
        if (step.getKnowledgePointCode() == null || step.getKnowledgePointCode().isBlank()) {
            notes.add("缺少知识点 code");
        }
        if (step.getKnowledgePointTitle() == null || step.getKnowledgePointTitle().isBlank()) {
            notes.add("缺少知识点标题");
        }
        if (variantCount <= 0) {
            notes.add("缺少题库变体数");
        }
        if ("待补素材主题".equals(assetTheme)) {
            notes.add("缺少素材主题");
        }
        if ("待补音频质量".equals(audioQuality)) {
            notes.add("缺少音频质量标记");
        }

        return notes;
    }

    private String extractJsonStringValue(String json, String key) {
        if (json == null || json.isBlank()) {
            return null;
        }

        String needle = "\"" + key + "\":\"";
        int start = json.indexOf(needle);
        if (start < 0) {
            return null;
        }

        int valueStart = start + needle.length();
        int valueEnd = json.indexOf('"', valueStart);
        if (valueEnd < 0) {
            return null;
        }

        return json.substring(valueStart, valueEnd);
    }

    private record ContentConfigSnapshot(
            LevelStepEntity step,
            String activityConfigJson,
            String knowledgePointCode,
            String knowledgePointTitle,
            int variantCount,
            String assetTheme,
            String audioQuality,
            String configSource,
            String healthStatus,
            List<String> healthNotes
    ) {
    }

    private MistakeReviewDraft toMistakeReviewItem(List<LevelCompletionEntity> levelCompletions) {
        LevelEntity level = levelCompletions.get(0).getLevel();
        String knowledgePointTitle = knowledgePointsForLevel(level).stream()
                .findFirst()
                .map(KnowledgePointDraft::title)
                .orElse(level.getSummaryTitle());
        int mistakeCount = levelCompletions.stream().mapToInt(LevelCompletionEntity::getWrongCount).sum();
        LocalDateTime latestCompletedAt = levelCompletions.stream()
                .map(LevelCompletionEntity::getCompletedAt)
                .max(LocalDateTime::compareTo)
                .orElse(LocalDateTime.MIN);

        return new MistakeReviewDraft(
                level.getDetailTitle(),
                knowledgePointTitle,
                mistakeCount,
                "复习“" + knowledgePointTitle + "”，先回看错因，再完成 1 组变式练习。",
                level.getCode(),
                latestCompletedAt
        );
    }

    private String readinessLabel(int completionPercent) {
        if (completionPercent >= 90) {
            return "阶段稳固";
        }
        if (completionPercent >= 60) {
            return "接近达标";
        }
        if (completionPercent >= 30) {
            return "正在建立";
        }
        return "刚刚起步";
    }

    private String knowledgeStatusLabel(int totalAttempts, int masteryPercent) {
        if (totalAttempts == 0) {
            return "待开始";
        }
        if (masteryPercent >= 85) {
            return "已掌握";
        }
        if (masteryPercent >= 60) {
            return "继续巩固";
        }
        return "需要复习";
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
        List<SubjectScore> subjectScores = getMainlineSubjects().stream()
                .map(subject -> {
                    List<LevelEntity> stageLevels = getStageLevels(subject, child);
                    Set<String> stageLevelCodes = stageLevels.stream()
                            .map(LevelEntity::getCode)
                            .collect(LinkedHashSet::new, Set::add, Set::addAll);
                    List<LevelCompletionEntity> subjectCompletions = completions.stream()
                            .filter(item -> stageLevelCodes.contains(item.getLevel().getCode()))
                            .toList();
                    int totalAttempts = subjectCompletions.stream()
                            .mapToInt(item -> item.getCorrectCount() + item.getWrongCount())
                            .sum();
                    int totalCorrect = subjectCompletions.stream().mapToInt(LevelCompletionEntity::getCorrectCount).sum();
                    double accuracy = totalAttempts == 0 ? 0 : totalCorrect * 1.0 / totalAttempts;
                    String nextLevelTitle = stageLevels.stream()
                            .filter(level -> !getCompletedLevelCodesForCurrentStage(child).contains(level.getCode()))
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
        Set<String> completedLevelCodes = getCompletedLevelCodesForCurrentStage(child);

        return getMainlineSubjects().stream()
                .flatMap(subject -> getStageLevels(subject, child).stream())
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
        return new RecentActivityDto(
                completion.getLevel().getChapter().getSubject().getTitle(),
                completion.getLevel().getDetailTitle(),
                toRelativeDateTimeLabel(completion.getCompletedAt()),
                completion.getLevel().getRewardStars()
        );
    }

    private String toRelativeDateTimeLabel(LocalDateTime recordedAt) {
        LocalDate date = recordedAt.toLocalDate();

        if (date.isEqual(LocalDate.now())) {
            return "今天 " + TIME_FORMATTER.format(recordedAt);
        }
        if (date.isEqual(LocalDate.now().minusDays(1))) {
            return "昨天 " + TIME_FORMATTER.format(recordedAt);
        }

        return recordedAt.getMonthValue() + "月"
                + recordedAt.getDayOfMonth() + "日 "
                + TIME_FORMATTER.format(recordedAt);
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
        List<AchievementBadgeDto> modelBadges = buildThinkingModelBadges(child);

        List<AchievementBadgeDto> unlockedBadges = badges.stream().filter(AchievementBadgeDto::unlocked).toList();
        List<AchievementBadgeDto> inProgressBadges = badges.stream()
                .filter(badge -> !badge.unlocked())
                .sorted(Comparator.comparingInt(AchievementBadgeDto::progressPercent).reversed())
                .toList();

        return new AchievementsResponse(
                child.getNickname(),
                unlockedBadges.size() + (int) modelBadges.stream().filter(AchievementBadgeDto::unlocked).count(),
                badges.size() + modelBadges.size(),
                resolveStageLabel(child),
                buildStageAchievementFamilies(child, completedLevelCodes, completions),
                modelBadges,
                unlockedBadges,
                inProgressBadges
        );
    }

    private List<AchievementBadgeDto> buildThinkingModelBadges(ChildProfileEntity child) {
        return buildThinkingModelProgress(child).stream()
                .map(model -> createBadge(
                        "model_" + model.modelCode(),
                        model.modelTitle() + "星",
                        "完成“" + model.modelTitle() + "”相关关卡",
                        model.completedLevels(),
                        Math.max(model.totalLevels(), 1),
                        "思维模型",
                        "模型徽章"
                ))
                .toList();
    }

    private List<AchievementStageFamilyDto> buildStageAchievementFamilies(
            ChildProfileEntity child,
            Set<String> completedLevelCodes,
            List<LevelCompletionEntity> completions
    ) {
        return CORE_STAGE_LABELS.stream()
                .filter(stageLabel -> stageLabel.equals(resolveStageLabel(child)) || !getLevelsForStageLabel(stageLabel).isEmpty())
                .map(stageLabel -> buildStageAchievementFamily(stageLabel, completedLevelCodes, completions))
                .toList();
    }

    private AchievementStageFamilyDto buildStageAchievementFamily(
            String stageLabel,
            Set<String> completedLevelCodes,
            List<LevelCompletionEntity> completions
    ) {
        Set<String> stageLevelCodes = getLevelsForStageLabel(stageLabel).stream()
                .map(LevelEntity::getCode)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        long completedInStage = completedLevelCodes.stream()
                .filter(stageLevelCodes::contains)
                .count();
        long completedSubjectCount = getLevelsForStageLabel(stageLabel).stream()
                .filter(level -> completedLevelCodes.contains(level.getCode()))
                .map(level -> level.getChapter().getSubject().getCode())
                .distinct()
                .count();
        List<LevelCompletionEntity> stageCompletions = completions.stream()
                .filter(completion -> stageLabel.equals(resolveStageLabel(completion.getLevel().getChapter())))
                .toList();
        int stageAccuracy = calculateAverageAccuracyPercent(stageCompletions);
        long mainlineTarget = Math.min(6, Math.max(stageLevelCodes.size(), 1));

        List<AchievementBadgeDto> badges = List.of(
                createBadge("stage_" + stageCode(stageLabel) + "_opener", stageLabel + "启航星", "完成 1 个" + stageLabel + "关卡", completedInStage, 1, stageLabel, "阶段徽章"),
                createBadge("stage_" + stageCode(stageLabel) + "_three_islands", stageLabel + "三岛探索家", "数学、语文、英语都完成至少 1 关", completedSubjectCount, 3, stageLabel, "阶段徽章"),
                createBadge("stage_" + stageCode(stageLabel) + "_mainline", stageLabel + "主线推进家", "完成 " + mainlineTarget + " 个" + stageLabel + "主线关卡", completedInStage, mainlineTarget, stageLabel, "阶段徽章"),
                createBadge("stage_" + stageCode(stageLabel) + "_accuracy", stageLabel + "稳稳通关星", "完成 3 关且平均准确率达到 85%", completedInStage >= 3 ? stageAccuracy : 0, 85, stageLabel, "阶段徽章")
        );
        int unlockedCount = (int) badges.stream().filter(AchievementBadgeDto::unlocked).count();

        return new AchievementStageFamilyDto(
                stageLabel,
                stageLabel + "成长路线",
                buildStageFamilyDescription(stageLabel),
                unlockedCount,
                badges.size(),
                badges.isEmpty() ? 0 : (int) Math.round(unlockedCount * 100.0 / badges.size()),
                badges
        );
    }

    private List<LevelEntity> getLevelsForStageLabel(String stageLabel) {
        return subjectRepository.findAll().stream()
                .filter(subject -> !"olympiad".equals(subject.getCode()))
                .flatMap(subject -> getStageLevels(subject, stageLabel).stream())
                .toList();
    }

    private String buildStageFamilyDescription(String stageLabel) {
        return switch (stageLabel) {
            case "幼小衔接" -> "入学准备阶段的三岛探索进度";
            case "一年级" -> "校园冒险阶段的基础能力成长进度";
            case "二年级" -> "结构思维和复习闭环的成长进度";
            case "三年级" -> "多步推理和阅读表达的成长进度";
            case "四年级" -> "抽象模型和策略表达的成长进度";
            default -> stageLabel + "阶段的学习成长进度";
        };
    }

    private String stageCode(String stageLabel) {
        return switch (stageLabel) {
            case "幼小衔接" -> "preschool";
            case "一年级" -> "grade1";
            case "二年级" -> "grade2";
            case "三年级" -> "grade3";
            case "四年级" -> "grade4";
            default -> stageLabel.toLowerCase().replaceAll("[^a-z0-9]+", "_");
        };
    }

    private String resolveStageLabel(ChapterEntity chapter) {
        return Optional.ofNullable(chapter.getStageLabel())
                .filter(label -> !label.isBlank())
                .orElse(DEFAULT_STAGE_LABEL);
    }

    private String buildWeakPointReason(String subjectTitle, double subjectAccuracy, int overallAccuracy) {
        int subjectAccuracyPercent = (int) Math.round(subjectAccuracy * 100);
        int gap = Math.max(overallAccuracy - subjectAccuracyPercent, 0);
        return "最近 7 天" + subjectTitle + "正确率 " + subjectAccuracyPercent + "%，比整体平均低了 " + gap + "%。";
    }

    private String buildRecommendedActionReason(ChildProfileEntity child, LevelEntity level) {
        String subjectTitle = level.getChapter().getSubject().getTitle();
        Set<String> currentStageCompletedCodes = getCompletedLevelCodesForCurrentStage(child);
        Set<String> subjectStageCodes = getStageLevels(level.getChapter().getSubject(), child).stream()
                .map(LevelEntity::getCode)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        long completedInSubject = currentStageCompletedCodes.stream()
                .filter(subjectStageCodes::contains)
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

    private CompletionLeaderboardFeedbackDto buildCompletionLeaderboardFeedback(
            ChildProfileEntity child,
            int scoreBefore,
            int scoreAfter,
            LocalDateTime latestActivityBefore,
            LocalDateTime latestActivityAfter
    ) {
        if (child.getParentSettings() != null && !child.getParentSettings().isLeaderboardEnabled()) {
            return new CompletionLeaderboardFeedbackDto(
                    getBoardTitle("weekly_star"),
                    0,
                    0,
                    "未参与排行榜",
                    "家长已关闭排行榜展示，星星仍会计入自己的成长记录。",
                    child.getTotalStars()
            );
        }

        int rankBefore = findRankWithOverride(child, scoreBefore, latestActivityBefore);
        int rankAfter = findRankWithOverride(child, scoreAfter, latestActivityAfter);
        int rankDelta = rankBefore - rankAfter;
        String trendLabel = rankDelta > 0 ? "上升 " + rankDelta + " 名" : "稳定第 " + rankAfter + " 名";
        String message = rankDelta > 0
                ? "星光榜更新啦，排名上升到第 " + rankAfter + " 名。"
                : "星光榜保持第 " + rankAfter + " 名，继续收集星星就能追上前面的小伙伴。";

        return new CompletionLeaderboardFeedbackDto(
                getBoardTitle("weekly_star"),
                rankBefore,
                rankAfter,
                trendLabel,
                message,
                child.getTotalStars()
        );
    }

    private int findRankWithOverride(ChildProfileEntity targetChild, int scoreOverride, LocalDateTime latestActivityOverride) {
        List<RankedChild> rankedChildren = childProfileRepository.findAllByOrderByIdAsc().stream()
                .filter(profile -> profile.getParentSettings() == null || profile.getParentSettings().isLeaderboardEnabled())
                .map(profile -> {
                    boolean isTarget = profile.getId().equals(targetChild.getId());
                    int score = isTarget ? scoreOverride : scoreForBoard("weekly_star", profile);
                    return new RankedChild(
                            profile,
                            score,
                            trendLabelForBoard("weekly_star", score),
                            isTarget ? latestActivityOverride : latestActivityAt(profile)
                    );
                })
                .sorted(Comparator
                        .comparingInt(RankedChild::score)
                        .reversed()
                        .thenComparing(RankedChild::latestActivityAt, Comparator.reverseOrder())
                        .thenComparing(item -> item.child().getId()))
                .toList();

        return findRankIndex(rankedChildren, targetChild.getId()) + 1;
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
                        .map(step -> new LevelStepDto(
                                step.getStepCode(),
                                step.getStepType(),
                                step.getPrompt(),
                                step.getActivityConfigJson(),
                                step.getKnowledgePointCode(),
                                step.getKnowledgePointTitle(),
                                step.getVariantCount()
                        ))
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

    private record KnowledgePointDraft(String code, String title, int variantCount) {
    }

    private record MistakeReviewDraft(
            String levelTitle,
            String knowledgePointTitle,
            int mistakeCount,
            String reviewAction,
            String targetLevelCode,
            LocalDateTime latestCompletedAt
    ) {
    }

    private record ThinkingModelDefinition(String modelCode, String modelTitle, String modelTypeLabel) {
    }

    private record ThinkingModelAccumulator(
            ThinkingModelDefinition definition,
            Set<String> totalLevelCodes,
            Set<String> completedLevelCodes
    ) {
        private ThinkingModelAccumulator(ThinkingModelDefinition definition) {
            this(definition, new LinkedHashSet<>(), new LinkedHashSet<>());
        }
    }

    private record MistakeReviewCardDraft(
            String levelCode,
            String levelTitle,
            String subjectTitle,
            String knowledgePointTitle,
            int mistakeCount,
            String masteryStatus,
            String reviewPrompt,
            List<String> reviewSteps,
            LocalDateTime latestCompletedAt
    ) {
    }
}
