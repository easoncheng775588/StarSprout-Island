package com.example.k12learninggame;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ApiSmokeTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnHealthStatus() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));
    }

    @Test
    void shouldReturnHomeOverview() throws Exception {
        mockMvc.perform(get("/api/home/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.child.nickname").value("小星星"))
                .andExpect(jsonPath("$.subjects[0].code").value("math"))
                .andExpect(jsonPath("$.achievementPreview.unlockedCount").value(4))
                .andExpect(jsonPath("$.nextLevelCode").value("math-addition-001"));
    }

    @Test
    void shouldReturnChildProfilesForLoginSelection() throws Exception {
        mockMvc.perform(get("/api/session/children"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.defaultChildId").value(1))
                .andExpect(jsonPath("$.children[0].nickname").value("小星星"))
                .andExpect(jsonPath("$.children[0].streakDays").value(3))
                .andExpect(jsonPath("$.children[1].nickname").value("小火箭"))
                .andExpect(jsonPath("$.children[1].streakDays").value(6))
                .andExpect(jsonPath("$.children[2].nickname").value("小海豚"));
    }

    @Test
    void shouldLoginParentAccountAndReturnScopedChildren() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phone": "13800000001",
                                  "password": "demo1234"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.parentAccountId").value(1))
                .andExpect(jsonPath("$.parentDisplayName").value("星星妈妈"))
                .andExpect(jsonPath("$.defaultChildId").value(1))
                .andExpect(jsonPath("$.children.length()").value(3))
                .andExpect(jsonPath("$.children[0].nickname").value("小星星"));
    }

    @Test
    @Transactional
    void shouldRegisterParentAccountAndAllowLogin() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "displayName": "月亮妈妈",
                                  "phone": "13800000009",
                                  "password": "moon1234"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.parentDisplayName").value("月亮妈妈"))
                .andExpect(jsonPath("$.defaultChildId").value(0))
                .andExpect(jsonPath("$.children.length()").value(0));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phone": "13800000009",
                                  "password": "moon1234"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.parentDisplayName").value("月亮妈妈"))
                .andExpect(jsonPath("$.defaultChildId").value(0))
                .andExpect(jsonPath("$.children.length()").value(0));
    }

    @Test
    @Transactional
    void shouldCreateChildProfileForParentAccount() throws Exception {
        mockMvc.perform(post("/api/parent/children")
                        .header("X-Parent-Account-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nickname": "小月亮",
                                  "title": "森林观察员",
                                  "stageLabel": "幼小衔接",
                                  "avatarColor": "#8ecae6"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nickname").value("小月亮"))
                .andExpect(jsonPath("$.stageLabel").value("幼小衔接"))
                .andExpect(jsonPath("$.avatarColor").value("#8ecae6"));
    }

    @Test
    @Transactional
    void shouldUpdateChildProfileForParentAccount() throws Exception {
        mockMvc.perform(patch("/api/parent/children/2")
                        .header("X-Parent-Account-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nickname": "小宇宙",
                                  "title": "云朵旅行家",
                                  "stageLabel": "一年级",
                                  "avatarColor": "#ffcf70"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.nickname").value("小宇宙"))
                .andExpect(jsonPath("$.title").value("云朵旅行家"))
                .andExpect(jsonPath("$.stageLabel").value("一年级"))
                .andExpect(jsonPath("$.avatarColor").value("#ffcf70"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phone": "13800000001",
                                  "password": "demo1234"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.children[1].nickname").value("小宇宙"))
                .andExpect(jsonPath("$.children[1].title").value("云朵旅行家"))
                .andExpect(jsonPath("$.children[1].stageLabel").value("一年级"))
                .andExpect(jsonPath("$.children[1].avatarColor").value("#ffcf70"));
    }

    @Test
    @Transactional
    void shouldPersistActiveChildSelectionForParentAccount() throws Exception {
        mockMvc.perform(patch("/api/parent/active-child")
                        .header("X-Parent-Account-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "childProfileId": 3
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.defaultChildId").value(3))
                .andExpect(jsonPath("$.children.length()").value(3));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phone": "13800000001",
                                  "password": "demo1234"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.defaultChildId").value(3))
                .andExpect(jsonPath("$.children[2].nickname").value("小海豚"));
    }

    @Test
    void shouldReturnSubjectMap() throws Exception {
        mockMvc.perform(get("/api/subjects/math/map").header("X-Child-Profile-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subject.code").value("math"))
                .andExpect(jsonPath("$.chapters[0].levels[0].code").value("math-numbers-001"))
                .andExpect(jsonPath("$.chapters[0].levels[0].status").value("completed"))
                .andExpect(jsonPath("$.chapters[0].levels[1].code").value("math-numbers-002"))
                .andExpect(jsonPath("$.chapters[0].levels[1].status").value("completed"))
                .andExpect(jsonPath("$.chapters[0].levels[2].code").value("math-addition-001"))
                .andExpect(jsonPath("$.chapters[0].levels[2].status").value("recommended"))
                .andExpect(jsonPath("$.chapters[0].levels[3].code").value("math-addition-002"))
                .andExpect(jsonPath("$.chapters[0].levels[5].code").value("math-thinking-002"))
                .andExpect(jsonPath("$.chapters[0].levels[7].code").value("math-subtraction-002"))
                .andExpect(jsonPath("$.chapters[0].levels[10].code").value("math-wordproblem-001"));
    }

    @Test
    void shouldReturnExpandedChineseSubjectMap() throws Exception {
        mockMvc.perform(get("/api/subjects/chinese/map"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subject.code").value("chinese"))
                .andExpect(jsonPath("$.chapters[0].title").value("汉字花园"))
                .andExpect(jsonPath("$.chapters[0].levels[2].code").value("chinese-characters-003"))
                .andExpect(jsonPath("$.chapters[1].title").value("拼音乐园"))
                .andExpect(jsonPath("$.chapters[1].levels[2].code").value("chinese-pinyin-003"))
                .andExpect(jsonPath("$.chapters[2].title").value("笔画写字屋"))
                .andExpect(jsonPath("$.chapters[2].levels[2].code").value("chinese-strokes-003"));
    }

    @Test
    void shouldReturnExpandedEnglishSubjectMap() throws Exception {
        mockMvc.perform(get("/api/subjects/english/map"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subject.code").value("english"))
                .andExpect(jsonPath("$.chapters[0].title").value("字母海湾"))
                .andExpect(jsonPath("$.chapters[1].title").value("拼读码头"))
                .andExpect(jsonPath("$.chapters[1].levels[1].code").value("english-phonics-002"))
                .andExpect(jsonPath("$.chapters[2].title").value("单词沙滩"))
                .andExpect(jsonPath("$.chapters[2].levels[2].code").value("english-words-003"))
                .andExpect(jsonPath("$.chapters[3].title").value("绘本港湾"))
                .andExpect(jsonPath("$.chapters[3].levels[2].code").value("english-story-003"));
    }

    @Test
    void shouldReturnLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/math-numbers-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("math-numbers-001"))
                .andExpect(jsonPath("$.steps[0].type").value("drag-match"));
    }

    @Test
    void shouldReturnNewStoryLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/english-story-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-story-001"))
                .andExpect(jsonPath("$.steps[0].type").value("sentence-read"));
    }

    @Test
    void shouldReturnNewMathLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/math-subtraction-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("math-subtraction-001"))
                .andExpect(jsonPath("$.steps[0].type").value("take-away"))
                .andExpect(jsonPath("$.steps[1].type").value("tap-choice"));
    }

    @Test
    void shouldReturnNewMathEquationLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/math-equation-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("math-equation-001"))
                .andExpect(jsonPath("$.steps[0].type").value("equation-choice"));
    }

    @Test
    void shouldReturnExpandedEnglishPhonicsLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/english-phonics-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-phonics-001"))
                .andExpect(jsonPath("$.steps[0].type").value("listen-choice"));
    }

    @Test
    void shouldReturnExpandedChineseWritingLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/chinese-strokes-003"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("chinese-strokes-003"))
                .andExpect(jsonPath("$.steps[0].type").value("stroke-order"));
    }

    @Test
    void shouldReturnExpandedEnglishStoryLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/english-story-003"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-story-003"))
                .andExpect(jsonPath("$.steps[0].type").value("sentence-read"));
    }

    @Test
    void shouldCompleteLevelAndReturnReward() throws Exception {
        mockMvc.perform(post("/api/levels/math-numbers-001/complete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"childProfileId\": 1,
                                  \"correctCount\": 2,
                                  \"wrongCount\": 0,
                                  \"durationSeconds\": 74
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reward.stars").value(3))
                .andExpect(jsonPath("$.reward.badgeName").value("数字小达人"));
    }

    @Test
    void shouldReturnParentDashboard() throws Exception {
        mockMvc.perform(get("/api/parent/dashboard").header("X-Child-Profile-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.childNickname").value("小星星"))
                .andExpect(jsonPath("$.todaySummary.completedLevels").value(3))
                .andExpect(jsonPath("$.subjectProgress[0].subjectCode").value("math"))
                .andExpect(jsonPath("$.weakPoints[0].title").value("数学岛还需要多一点细心练习"))
                .andExpect(jsonPath("$.weakPoints[0].reason").isNotEmpty())
                .andExpect(jsonPath("$.achievementSummary.unlockedCount").value(4))
                .andExpect(jsonPath("$.goalProgress.completionPercent").value(90))
                .andExpect(jsonPath("$.recommendedActions[0].title").value("继续挑战 10 以内加法"))
                .andExpect(jsonPath("$.recommendedActions[0].reason").isNotEmpty())
                .andExpect(jsonPath("$.recommendedActions[0].targetSubject").value("数学岛"))
                .andExpect(jsonPath("$.settings.leaderboardEnabled").value(true))
                .andExpect(jsonPath("$.learningVitals.totalCompletedLevels").value(5))
                .andExpect(jsonPath("$.learningVitals.averageAccuracyPercent").value(86))
                .andExpect(jsonPath("$.learningVitals.averageSessionMinutes").value(6))
                .andExpect(jsonPath("$.learningVitals.bestLearningPeriodLabel").isNotEmpty())
                .andExpect(jsonPath("$.learningVitals.effectiveLearningDays").value(3))
                .andExpect(jsonPath("$.subjectInsights[0].subjectCode").value("math"))
                .andExpect(jsonPath("$.subjectInsights[0].completedLevels").value(2))
                .andExpect(jsonPath("$.subjectInsights[0].totalLevels").value(11))
                .andExpect(jsonPath("$.subjectInsights[0].accuracyPercent").value(75))
                .andExpect(jsonPath("$.subjectInsights[0].nextLevelReason").isNotEmpty())
                .andExpect(jsonPath("$.recentActivities[0].subjectTitle").value("语文岛"));
    }

    @Test
    @Transactional
    void shouldPersistParentSettingsAndDisableLeaderboardParticipation() throws Exception {
        mockMvc.perform(patch("/api/parent/settings")
                        .header("X-Child-Profile-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "leaderboardEnabled": false,
                                  "dailyStudyMinutes": 25,
                                  "reminderEnabled": true
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.leaderboardEnabled").value(false))
                .andExpect(jsonPath("$.dailyStudyMinutes").value(25))
                .andExpect(jsonPath("$.reminderEnabled").value(true));

        mockMvc.perform(get("/api/parent/dashboard").header("X-Child-Profile-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.settings.leaderboardEnabled").value(false))
                .andExpect(jsonPath("$.settings.dailyStudyMinutes").value(25))
                .andExpect(jsonPath("$.settings.reminderEnabled").value(true));

        mockMvc.perform(get("/api/leaderboard/weekly_star").header("X-Child-Profile-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.participationEnabled").value(false))
                .andExpect(jsonPath("$.nextTargetText").value("当前孩子未参与榜单展示"))
                .andExpect(jsonPath("$.myRank.rank").value(0))
                .andExpect(jsonPath("$.myRank.trendLabel").value("未参与排行榜"));
    }

    @Test
    void shouldReturnWeeklyLeaderboard() throws Exception {
        mockMvc.perform(get("/api/leaderboard/weekly_star").header("X-Child-Profile-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.boardType").value("weekly_star"))
                .andExpect(jsonPath("$.boardTitle").value("本周星星榜"))
                .andExpect(jsonPath("$.metricUnit").value("颗星"))
                .andExpect(jsonPath("$.settlementWindowLabel").value("近 7 天星星结算"))
                .andExpect(jsonPath("$.nextTargetText").value("距离上一名还差 1 颗星"))
                .andExpect(jsonPath("$.myRank.nickname").value("小星星"))
                .andExpect(jsonPath("$.myRank.rank").value(3))
                .andExpect(jsonPath("$.topPlayers[0].nickname").value("小火箭"))
                .andExpect(jsonPath("$.nearbyPlayers[1].nickname").value("小星星"));
    }

    @Test
    void shouldReturnStreakLeaderboard() throws Exception {
        mockMvc.perform(get("/api/leaderboard/streak_master").header("X-Child-Profile-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.boardType").value("streak_master"))
                .andExpect(jsonPath("$.boardTitle").value("连续学习榜"))
                .andExpect(jsonPath("$.metricUnit").value("天"))
                .andExpect(jsonPath("$.settlementWindowLabel").value("按自然日连续学习实时结算"))
                .andExpect(jsonPath("$.myRank.rank").value(3))
                .andExpect(jsonPath("$.myRank.stars").value(3))
                .andExpect(jsonPath("$.myRank.trendLabel").value("已经连续学习 3 天"))
                .andExpect(jsonPath("$.topPlayers[0].nickname").value("小火箭"))
                .andExpect(jsonPath("$.topPlayers[0].stars").value(6));
    }

    @Test
    void shouldReturnAchievementWall() throws Exception {
        mockMvc.perform(get("/api/achievements").header("X-Child-Profile-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.childNickname").value("小星星"))
                .andExpect(jsonPath("$.unlockedCount").value(4))
                .andExpect(jsonPath("$.unlockedBadges[0].title").value("数字小达人"))
                .andExpect(jsonPath("$.unlockedBadges[0].category").value("数学启蒙"))
                .andExpect(jsonPath("$.unlockedBadges[0].progressPercent").value(100))
                .andExpect(jsonPath("$.inProgressBadges[0].title").value("细心守护星"));
    }
}
