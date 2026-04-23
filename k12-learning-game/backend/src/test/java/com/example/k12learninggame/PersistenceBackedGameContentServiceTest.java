package com.example.k12learninggame;

import com.example.k12learninggame.domain.LevelCompletionEntity;
import com.example.k12learninggame.domain.FluencyAttemptEntity;
import com.example.k12learninggame.dto.AuthLoginRequest;
import com.example.k12learninggame.dto.CompleteLevelRequest;
import com.example.k12learninggame.dto.HomeOverviewResponse;
import com.example.k12learninggame.dto.SubjectCardDto;
import com.example.k12learninggame.repository.ChildProfileRepository;
import com.example.k12learninggame.repository.FluencyAttemptRepository;
import com.example.k12learninggame.repository.LevelCompletionRepository;
import com.example.k12learninggame.repository.SubjectRepository;
import com.example.k12learninggame.service.GameContentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class PersistenceBackedGameContentServiceTest {

    @Autowired
    private GameContentService gameContentService;

    @Autowired
    private ChildProfileRepository childProfileRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private LevelCompletionRepository levelCompletionRepository;

    @Autowired
    private FluencyAttemptRepository fluencyAttemptRepository;

    @Test
    void shouldReadHomeOverviewFromDatabaseState() {
        var child = childProfileRepository.findById(1L).orElseThrow();
        child.setNickname("小勇士");
        childProfileRepository.save(child);

        var mathSubject = subjectRepository.findById("math").orElseThrow();
        mathSubject.setTitle("数学冒险岛");
        subjectRepository.save(mathSubject);

        HomeOverviewResponse response = gameContentService.getHomeOverview(1L);

        assertThat(response.child().nickname()).isEqualTo("小勇士");
        assertThat(response.subjects())
                .extracting(SubjectCardDto::title)
                .contains("数学冒险岛");
    }

    @Test
    void shouldPersistLevelCompletionRecords() {
        long initialCount = levelCompletionRepository.count();
        gameContentService.completeLevel("math-numbers-001", new CompleteLevelRequest(1L, 2, 0, 74));

        assertThat(levelCompletionRepository.count()).isEqualTo(initialCount + 1);

        LevelCompletionEntity completion = levelCompletionRepository.findAll().get(levelCompletionRepository.findAll().size() - 1);
        assertThat(completion.getLevel().getCode()).isEqualTo("math-numbers-001");
        assertThat(completion.getChildProfile().getId()).isEqualTo(1L);
        assertThat(completion.getCorrectCount()).isEqualTo(2);
        assertThat(completion.getWrongCount()).isEqualTo(0);
        assertThat(completion.getDurationSeconds()).isEqualTo(74);
        assertThat(completion.getResultMessage()).isEqualTo("perfect");
    }

    @Test
    @Transactional
    void shouldDifferentiateFirstCompletionFromRepeatPracticeSettlement() {
        int initialStars = childProfileRepository.findById(1L).orElseThrow().getTotalStars();

        var firstCompletion = gameContentService.completeLevel("math-addition-001", new CompleteLevelRequest(1L, 1, 0, 66));

        assertThat(firstCompletion.isFirstCompletion()).isTrue();
        assertThat(firstCompletion.effectiveStars()).isEqualTo(2);
        assertThat(firstCompletion.totalStars()).isEqualTo(initialStars + 2);

        var repeatedCompletion = gameContentService.completeLevel("math-addition-001", new CompleteLevelRequest(1L, 1, 0, 61));

        assertThat(repeatedCompletion.isFirstCompletion()).isFalse();
        assertThat(repeatedCompletion.effectiveStars()).isZero();
        assertThat(repeatedCompletion.totalStars()).isEqualTo(initialStars + 2);
    }

    @Test
    @Transactional
    void shouldReturnNewlyUnlockedAchievementsOnCompletion() {
        var completion = gameContentService.completeLevel("math-addition-001", new CompleteLevelRequest(1L, 1, 0, 66));

        assertThat(completion.newlyUnlockedBadges())
                .extracting(badge -> badge.title())
                .contains("本周小冠军");
    }

    @Test
    @Transactional
    void shouldComputeDynamicStreakForLeaderboardAndSessionProfiles() {
        var leaderboard = gameContentService.getLeaderboard("streak_master", 1L);
        var session = gameContentService.login(new AuthLoginRequest("13800000001", "demo1234"));
        var achievements = gameContentService.getAchievements(1L);

        assertThat(leaderboard.myRank().rank()).isEqualTo(3);
        assertThat(leaderboard.myRank().stars()).isEqualTo(3);
        assertThat(leaderboard.myRank().trendLabel()).isEqualTo("已经连续学习 3 天");
        assertThat(leaderboard.topPlayers())
                .extracting(item -> item.nickname(), item -> item.stars())
                .containsExactly(
                        org.assertj.core.groups.Tuple.tuple("小火箭", 6),
                        org.assertj.core.groups.Tuple.tuple("小海豚", 6),
                        org.assertj.core.groups.Tuple.tuple("小星星", 3)
                );
        assertThat(session.children())
                .extracting(child -> child.nickname(), child -> child.streakDays())
                .containsExactly(
                        org.assertj.core.groups.Tuple.tuple("小星星", 3),
                        org.assertj.core.groups.Tuple.tuple("小火箭", 6),
                        org.assertj.core.groups.Tuple.tuple("小海豚", 6)
                );
        assertThat(achievements.inProgressBadges())
                .filteredOn(badge -> badge.code().equals("steady_streak"))
                .singleElement()
                .satisfies(badge -> {
                    assertThat(badge.progressText()).isEqualTo("3 / 10");
                    assertThat(badge.encouragement()).contains("7");
                });
    }

    @Test
    @Transactional
    void shouldSettleWeeklyBoardsUsingOnlyEffectiveCompletions() {
        var initialWeeklyBoard = gameContentService.getLeaderboard("weekly_star", 1L);
        var initialChallengeBoard = gameContentService.getLeaderboard("challenge_hero", 1L);

        gameContentService.completeLevel("math-addition-001", new CompleteLevelRequest(1L, 1, 0, 66));

        var boardAfterFirstCompletion = gameContentService.getLeaderboard("weekly_star", 1L);
        var challengeAfterFirstCompletion = gameContentService.getLeaderboard("challenge_hero", 1L);
        var achievementsAfterFirstCompletion = gameContentService.getAchievements(1L);

        gameContentService.completeLevel("math-addition-001", new CompleteLevelRequest(1L, 1, 0, 61));

        var boardAfterRepeatCompletion = gameContentService.getLeaderboard("weekly_star", 1L);
        var challengeAfterRepeatCompletion = gameContentService.getLeaderboard("challenge_hero", 1L);

        assertThat(initialWeeklyBoard.myRank().stars()).isEqualTo(9);
        assertThat(initialChallengeBoard.myRank().stars()).isEqualTo(5);
        assertThat(boardAfterFirstCompletion.myRank().stars()).isEqualTo(11);
        assertThat(challengeAfterFirstCompletion.myRank().stars()).isEqualTo(6);
        assertThat(boardAfterRepeatCompletion.myRank().stars()).isEqualTo(11);
        assertThat(challengeAfterRepeatCompletion.myRank().stars()).isEqualTo(6);
        assertThat(achievementsAfterFirstCompletion.unlockedBadges())
                .extracting(badge -> badge.code())
                .contains("weekly_champion");
    }

    @Test
    @Transactional
    void shouldBuildFluencySummaryUsingRecentAttemptsOnly() {
        var child = childProfileRepository.findById(1L).orElseThrow();
        fluencyAttemptRepository.save(new FluencyAttemptEntity(
                child,
                "幼小衔接",
                5,
                1,
                62,
                20,
                LocalDate.now().minusDays(8),
                LocalDateTime.now().minusDays(8)
        ));
        fluencyAttemptRepository.save(new FluencyAttemptEntity(
                child,
                "幼小衔接",
                5,
                3,
                61,
                60,
                LocalDate.now().minusDays(6),
                LocalDateTime.now().minusDays(6)
        ));
        fluencyAttemptRepository.save(new FluencyAttemptEntity(
                child,
                "一年级",
                5,
                4,
                55,
                80,
                LocalDate.now().minusDays(2),
                LocalDateTime.now().minusDays(2)
        ));
        fluencyAttemptRepository.save(new FluencyAttemptEntity(
                child,
                "二年级",
                5,
                5,
                48,
                100,
                LocalDate.now(),
                LocalDateTime.now()
        ));

        var dashboard = gameContentService.getParentDashboard(1L);

        assertThat(dashboard.fluencySummary()).isNotNull();
        assertThat(dashboard.fluencySummary().attemptCount()).isEqualTo(3);
        assertThat(dashboard.fluencySummary().averageAccuracyPercent()).isEqualTo(80);
        assertThat(dashboard.fluencySummary().latestStageLabel()).isEqualTo("二年级");
        assertThat(dashboard.fluencySummary().latestAccuracyPercent()).isEqualTo(100);
        assertThat(dashboard.fluencySummary().latestRecordedAtLabel()).contains("今天");
        assertThat(dashboard.fluencySummary().encouragement()).contains("3 次");
        assertThat(dashboard.fluencySummary().fluencyTrend()).hasSize(7);
        assertThat(dashboard.fluencySummary().fluencyTrend())
                .extracting(point -> point.dayLabel(), point -> point.attemptCount(), point -> point.averageAccuracyPercent())
                .containsExactly(
                        org.assertj.core.groups.Tuple.tuple(LocalDate.now().minusDays(6).getMonthValue() + "/" + LocalDate.now().minusDays(6).getDayOfMonth(), 1, 60),
                        org.assertj.core.groups.Tuple.tuple(LocalDate.now().minusDays(5).getMonthValue() + "/" + LocalDate.now().minusDays(5).getDayOfMonth(), 0, 0),
                        org.assertj.core.groups.Tuple.tuple(LocalDate.now().minusDays(4).getMonthValue() + "/" + LocalDate.now().minusDays(4).getDayOfMonth(), 0, 0),
                        org.assertj.core.groups.Tuple.tuple(LocalDate.now().minusDays(3).getMonthValue() + "/" + LocalDate.now().minusDays(3).getDayOfMonth(), 0, 0),
                        org.assertj.core.groups.Tuple.tuple(LocalDate.now().minusDays(2).getMonthValue() + "/" + LocalDate.now().minusDays(2).getDayOfMonth(), 1, 80),
                        org.assertj.core.groups.Tuple.tuple(LocalDate.now().minusDays(1).getMonthValue() + "/" + LocalDate.now().minusDays(1).getDayOfMonth(), 0, 0),
                        org.assertj.core.groups.Tuple.tuple(LocalDate.now().getMonthValue() + "/" + LocalDate.now().getDayOfMonth(), 1, 100)
                );
        assertThat(dashboard.fluencySummary().stageInsights())
                .extracting(item -> item.stageLabel(), item -> item.attemptCount(), item -> item.averageAccuracyPercent(), item -> item.statusLabel())
                .containsExactly(
                        org.assertj.core.groups.Tuple.tuple("幼小衔接", 1, 60, "建议回看"),
                        org.assertj.core.groups.Tuple.tuple("一年级", 1, 80, "继续巩固"),
                        org.assertj.core.groups.Tuple.tuple("二年级", 1, 100, "稳定发挥")
                );
        assertThat(dashboard.fluencySummary().stageInsights().get(0).recommendation()).contains("幼小衔接");
    }

    @Test
    @Transactional
    void shouldUseStageSpecificCurriculumForYearOneChildren() {
        var child = childProfileRepository.findById(2L).orElseThrow();
        child.setStageLabel("一年级");
        childProfileRepository.save(child);

        var homeOverview = gameContentService.getHomeOverview(2L);
        var mathMap = gameContentService.getSubjectMap("math", 2L);
        var dashboard = gameContentService.getParentDashboard(2L);

        assertThat(homeOverview.nextLevelCode()).isEqualTo("math-grade1-numbers-001");
        assertThat(homeOverview.nextLevelTitle()).isEqualTo("认识 100 以内的数");
        assertThat(mathMap.chapters())
                .extracting(chapter -> chapter.code(), chapter -> chapter.title())
                .containsExactly(
                        org.assertj.core.groups.Tuple.tuple("math-grade1-numbers", "百数启航站"),
                        org.assertj.core.groups.Tuple.tuple("math-grade1-life", "生活应用站")
                );
        assertThat(mathMap.chapters().get(0).levels())
                .extracting(level -> level.code())
                .containsExactly(
                        "math-grade1-numbers-001",
                        "math-grade1-hundredchart-001",
                        "math-grade1-numberline-001",
                        "math-grade1-addition-001"
                );
        assertThat(mathMap.chapters().get(1).levels())
                .extracting(level -> level.code())
                .containsExactly(
                        "math-grade1-subtraction-001",
                        "math-grade1-wordproblem-001",
                        "math-grade1-money-001",
                        "math-grade1-time-001",
                        "math-grade1-shape-001"
                );
        assertThat(dashboard.subjectInsights())
                .filteredOn(insight -> insight.subjectCode().equals("math"))
                .singleElement()
                .satisfies(insight -> {
                    assertThat(insight.completedLevels()).isZero();
                    assertThat(insight.totalLevels()).isEqualTo(9);
                    assertThat(insight.nextLevelTitle()).isEqualTo("认识 100 以内的数");
                });
    }

    @Test
    @Transactional
    void shouldExposeNumberShapeThinkingCurriculumForYearTwoAndThreeMath() {
        var yearTwoChild = childProfileRepository.findById(2L).orElseThrow();
        yearTwoChild.setStageLabel("二年级");
        childProfileRepository.save(yearTwoChild);

        var yearThreeChild = childProfileRepository.findById(3L).orElseThrow();
        yearThreeChild.setStageLabel("三年级");
        childProfileRepository.save(yearThreeChild);

        var yearTwoMathMap = gameContentService.getSubjectMap("math", 2L);
        var yearThreeMathMap = gameContentService.getSubjectMap("math", 3L);
        var yearTwoDashboard = gameContentService.getParentDashboard(2L);
        var yearThreeDashboard = gameContentService.getParentDashboard(3L);

        assertThat(yearTwoMathMap.chapters())
                .flatExtracting(chapter -> chapter.levels())
                .extracting(level -> level.code())
                .contains(
                        "math-grade2-array-001",
                        "math-grade2-bar-model-001",
                        "math-grade2-division-001",
                        "math-grade2-statistics-001"
                );
        assertThat(yearThreeMathMap.chapters())
                .flatExtracting(chapter -> chapter.levels())
                .extracting(level -> level.code())
                .contains(
                        "math-grade3-area-model-001",
                        "math-grade3-fractionbar-001",
                        "math-grade3-remainder-001",
                        "math-grade3-area-001"
                );
        assertThat(yearTwoDashboard.subjectInsights())
                .filteredOn(insight -> insight.subjectCode().equals("math"))
                .singleElement()
                .satisfies(insight -> assertThat(insight.totalLevels()).isEqualTo(8));
        assertThat(yearTwoDashboard.thinkingModelProgress())
                .extracting(model -> model.modelCode(), model -> model.modelTitle())
                .contains(
                        org.assertj.core.groups.Tuple.tuple("array-model", "数组模型"),
                        org.assertj.core.groups.Tuple.tuple("bar-model", "线段图模型")
                );
        assertThat(yearThreeDashboard.subjectInsights())
                .filteredOn(insight -> insight.subjectCode().equals("math"))
                .singleElement()
                .satisfies(insight -> assertThat(insight.totalLevels()).isEqualTo(8));
        assertThat(yearThreeDashboard.thinkingModelProgress())
                .extracting(model -> model.modelCode(), model -> model.modelTitle())
                .contains(
                        org.assertj.core.groups.Tuple.tuple("area-model", "面积模型"),
                        org.assertj.core.groups.Tuple.tuple("fraction-bar", "分数条模型")
                );
    }

    @Test
    @Transactional
    void shouldExposeThinkingModelBadgesForCurrentStageAchievements() {
        var child = childProfileRepository.findById(2L).orElseThrow();
        child.setStageLabel("二年级");
        childProfileRepository.save(child);

        var achievements = gameContentService.getAchievements(2L);

        assertThat(achievements.modelBadges())
                .extracting(badge -> badge.code(), badge -> badge.title(), badge -> badge.category(), badge -> badge.rarityLabel())
                .contains(
                        org.assertj.core.groups.Tuple.tuple("model_array-model", "数组模型星", "思维模型", "模型徽章"),
                        org.assertj.core.groups.Tuple.tuple("model_bar-model", "线段图模型星", "思维模型", "模型徽章")
                );
    }

    @Test
    @Transactional
    void shouldUseStageSpecificCurriculumForYearTwoChildren() {
        var child = childProfileRepository.findById(3L).orElseThrow();
        child.setStageLabel("二年级");
        childProfileRepository.save(child);

        var homeOverview = gameContentService.getHomeOverview(3L);
        var englishMap = gameContentService.getSubjectMap("english", 3L);
        var dashboard = gameContentService.getParentDashboard(3L);

        assertThat(homeOverview.nextLevelCode()).isEqualTo("math-grade2-multiply-001");
        assertThat(homeOverview.nextLevelTitle()).isEqualTo("表内乘法起步");
        assertThat(englishMap.chapters())
                .extracting(chapter -> chapter.code(), chapter -> chapter.title())
                .containsExactly(
                        org.assertj.core.groups.Tuple.tuple("english-grade2-phonics", "拼读进阶港"),
                        org.assertj.core.groups.Tuple.tuple("english-grade2-story", "表达故事湾")
                );
        assertThat(dashboard.subjectInsights())
                .filteredOn(insight -> insight.subjectCode().equals("english"))
                .singleElement()
                .satisfies(insight -> {
                    assertThat(insight.completedLevels()).isZero();
                    assertThat(insight.totalLevels()).isEqualTo(6);
                    assertThat(insight.nextLevelTitle()).isEqualTo("自然拼读进阶");
                });
    }

    @Test
    @Transactional
    void shouldUseStageSpecificCurriculumForYearThreeChildren() {
        var child = childProfileRepository.findById(2L).orElseThrow();
        child.setStageLabel("三年级");
        childProfileRepository.save(child);

        var homeOverview = gameContentService.getHomeOverview(2L);
        var chineseMap = gameContentService.getSubjectMap("chinese", 2L);
        var dashboard = gameContentService.getParentDashboard(2L);

        assertThat(homeOverview.nextLevelCode()).isEqualTo("math-grade3-division-001");
        assertThat(homeOverview.nextLevelTitle()).isEqualTo("除法平均分");
        assertThat(chineseMap.chapters())
                .extracting(chapter -> chapter.code(), chapter -> chapter.title())
                .containsExactly(
                        org.assertj.core.groups.Tuple.tuple("chinese-grade3-reading", "段落理解站"),
                        org.assertj.core.groups.Tuple.tuple("chinese-grade3-expression", "表达修辞屋")
                );
        assertThat(dashboard.subjectInsights())
                .filteredOn(insight -> insight.subjectCode().equals("chinese"))
                .singleElement()
                .satisfies(insight -> {
                    assertThat(insight.completedLevels()).isZero();
                    assertThat(insight.totalLevels()).isEqualTo(6);
                    assertThat(insight.nextLevelTitle()).isEqualTo("段落理解");
                });
    }

    @Test
    @Transactional
    void shouldUseStageSpecificCurriculumForYearFourChildren() {
        var child = childProfileRepository.findById(3L).orElseThrow();
        child.setStageLabel("四年级");
        childProfileRepository.save(child);

        var homeOverview = gameContentService.getHomeOverview(3L);
        var mathMap = gameContentService.getSubjectMap("math", 3L);
        var dashboard = gameContentService.getParentDashboard(3L);

        assertThat(homeOverview.nextLevelCode()).isEqualTo("math-grade4-decimal-001");
        assertThat(homeOverview.nextLevelTitle()).isEqualTo("小数初步");
        assertThat(mathMap.chapters())
                .extracting(chapter -> chapter.code(), chapter -> chapter.title())
                .containsExactly(
                        org.assertj.core.groups.Tuple.tuple("math-grade4-numbers", "小数图形站"),
                        org.assertj.core.groups.Tuple.tuple("math-grade4-strategy", "运算策略站")
                );
        assertThat(mathMap.chapters().get(0).levels())
                .extracting(level -> level.code())
                .containsExactly(
                        "math-grade4-decimal-001",
                        "math-grade4-decimal-compare-001",
                        "math-grade4-hundredths-001",
                        "math-grade4-angle-001",
                        "math-grade4-angle-classify-001",
                        "math-grade4-parallel-001"
                );
        assertThat(mathMap.chapters().get(1).levels())
                .extracting(level -> level.code())
                .containsExactly(
                        "math-grade4-operation-001",
                        "math-grade4-distributive-001",
                        "math-grade4-strategy-001",
                        "math-grade4-distance-001"
                );
        assertThat(dashboard.subjectInsights())
                .filteredOn(insight -> insight.subjectCode().equals("math"))
                .singleElement()
                .satisfies(insight -> {
                    assertThat(insight.completedLevels()).isZero();
                    assertThat(insight.totalLevels()).isEqualTo(10);
                    assertThat(insight.nextLevelTitle()).isEqualTo("小数初步");
                });
    }
}
