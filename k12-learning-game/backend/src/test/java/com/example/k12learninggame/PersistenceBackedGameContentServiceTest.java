package com.example.k12learninggame;

import com.example.k12learninggame.domain.LevelCompletionEntity;
import com.example.k12learninggame.dto.AuthLoginRequest;
import com.example.k12learninggame.dto.CompleteLevelRequest;
import com.example.k12learninggame.dto.HomeOverviewResponse;
import com.example.k12learninggame.dto.SubjectCardDto;
import com.example.k12learninggame.repository.ChildProfileRepository;
import com.example.k12learninggame.repository.LevelCompletionRepository;
import com.example.k12learninggame.repository.SubjectRepository;
import com.example.k12learninggame.service.GameContentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

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
        assertThat(dashboard.subjectInsights())
                .filteredOn(insight -> insight.subjectCode().equals("math"))
                .singleElement()
                .satisfies(insight -> {
                    assertThat(insight.completedLevels()).isZero();
                    assertThat(insight.totalLevels()).isEqualTo(6);
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
                        "math-grade2-bar-model-001"
                );
        assertThat(yearThreeMathMap.chapters())
                .flatExtracting(chapter -> chapter.levels())
                .extracting(level -> level.code())
                .contains(
                        "math-grade3-area-model-001",
                        "math-grade3-fractionbar-001"
                );
        assertThat(yearTwoDashboard.subjectInsights())
                .filteredOn(insight -> insight.subjectCode().equals("math"))
                .singleElement()
                .satisfies(insight -> assertThat(insight.totalLevels()).isEqualTo(6));
        assertThat(yearThreeDashboard.subjectInsights())
                .filteredOn(insight -> insight.subjectCode().equals("math"))
                .singleElement()
                .satisfies(insight -> assertThat(insight.totalLevels()).isEqualTo(6));
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
                    assertThat(insight.totalLevels()).isEqualTo(4);
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
                    assertThat(insight.totalLevels()).isEqualTo(4);
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
        assertThat(dashboard.subjectInsights())
                .filteredOn(insight -> insight.subjectCode().equals("math"))
                .singleElement()
                .satisfies(insight -> {
                    assertThat(insight.completedLevels()).isZero();
                    assertThat(insight.totalLevels()).isEqualTo(4);
                    assertThat(insight.nextLevelTitle()).isEqualTo("小数初步");
                });
    }
}
