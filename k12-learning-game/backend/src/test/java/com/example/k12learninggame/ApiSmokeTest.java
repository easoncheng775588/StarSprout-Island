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
                .andExpect(jsonPath("$.chapters[0].levels[10].code").value("math-wordproblem-001"))
                .andExpect(jsonPath("$.chapters[0].levels[11].code").value("math-shapes-001"))
                .andExpect(jsonPath("$.chapters[0].levels[12].code").value("math-position-001"))
                .andExpect(jsonPath("$.chapters[0].levels[13].code").value("math-ordinal-001"))
                .andExpect(jsonPath("$.chapters[0].levels[14].code").value("math-subitizing-001"))
                .andExpect(jsonPath("$.chapters[0].levels[15].code").value("math-part-whole-001"))
                .andExpect(jsonPath("$.chapters[0].levels[16].code").value("math-picture-addition-001"));
    }

    @Test
    void shouldReturnExpandedChineseSubjectMap() throws Exception {
        mockMvc.perform(get("/api/subjects/chinese/map"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subject.code").value("chinese"))
                .andExpect(jsonPath("$.chapters[0].title").value("汉字花园"))
                .andExpect(jsonPath("$.chapters[0].levels[2].code").value("chinese-characters-003"))
                .andExpect(jsonPath("$.chapters[0].levels[3].code").value("chinese-radicals-001"))
                .andExpect(jsonPath("$.chapters[1].title").value("拼音乐园"))
                .andExpect(jsonPath("$.chapters[1].levels[2].code").value("chinese-pinyin-003"))
                .andExpect(jsonPath("$.chapters[1].levels[3].code").value("chinese-pinyin-tone-001"))
                .andExpect(jsonPath("$.chapters[2].title").value("笔画写字屋"))
                .andExpect(jsonPath("$.chapters[2].levels[2].code").value("chinese-strokes-003"))
                .andExpect(jsonPath("$.chapters[2].levels[3].code").value("chinese-strokes-004"));
    }

    @Test
    void shouldReturnExpandedEnglishSubjectMap() throws Exception {
        mockMvc.perform(get("/api/subjects/english/map"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subject.code").value("english"))
                .andExpect(jsonPath("$.chapters[0].title").value("字母海湾"))
                .andExpect(jsonPath("$.chapters[0].levels[4].code").value("english-case-001"))
                .andExpect(jsonPath("$.chapters[0].levels[5].code").value("english-letter-sounds-001"))
                .andExpect(jsonPath("$.chapters[0].levels[6].code").value("english-letter-sounds-002"))
                .andExpect(jsonPath("$.chapters[1].title").value("拼读码头"))
                .andExpect(jsonPath("$.chapters[1].levels[1].code").value("english-phonics-002"))
                .andExpect(jsonPath("$.chapters[2].title").value("单词沙滩"))
                .andExpect(jsonPath("$.chapters[2].levels[2].code").value("english-words-003"))
                .andExpect(jsonPath("$.chapters[2].levels[3].code").value("english-family-001"))
                .andExpect(jsonPath("$.chapters[2].levels[4].code").value("english-word-sounds-001"))
                .andExpect(jsonPath("$.chapters[2].levels[5].code").value("english-word-sounds-002"))
                .andExpect(jsonPath("$.chapters[3].title").value("绘本港湾"))
                .andExpect(jsonPath("$.chapters[3].levels[2].code").value("english-story-003"))
                .andExpect(jsonPath("$.chapters[3].levels[3].code").value("english-story-004"))
                .andExpect(jsonPath("$.chapters[3].levels[4].code").value("english-daily-sentences-001"))
                .andExpect(jsonPath("$.chapters[3].levels[5].code").value("english-dialogue-001"));
    }

    @Test
    void shouldReturnBackendDrivenActivityConfigForRepresentativeLevel() throws Exception {
        mockMvc.perform(get("/api/levels/math-grade4-decimal-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("number-choice")))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("assetTheme")))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("audioQuality")))
                .andExpect(jsonPath("$.steps[0].knowledgePointCode").value("math.g4.decimal.tenths"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("小数初步：十分位"))
                .andExpect(jsonPath("$.steps[0].variantCount").value(6));
    }

    @Test
    void shouldReturnDailyTasks() throws Exception {
        mockMvc.perform(get("/api/daily-tasks").header("X-Child-Profile-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.childNickname").value("小星星"))
                .andExpect(jsonPath("$.totalCount").value(3))
                .andExpect(jsonPath("$.tasks.length()").value(3))
                .andExpect(jsonPath("$.tasks[0].code").value(org.hamcrest.Matchers.not(org.hamcrest.Matchers.isEmptyOrNullString())))
                .andExpect(jsonPath("$.tasks[0].taskType").exists())
                .andExpect(jsonPath("$.tasks[0].statusLabel").exists())
                .andExpect(jsonPath("$.completedCount").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)));
    }

    @Test
    @Transactional
    void shouldClaimDailyTaskRewardOnlyOnce() throws Exception {
        mockMvc.perform(post("/api/daily-tasks/mistake-review/claim")
                        .header("X-Child-Profile-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskCode").value("mistake-review"))
                .andExpect(jsonPath("$.claimed").value(true))
                .andExpect(jsonPath("$.alreadyClaimed").value(false))
                .andExpect(jsonPath("$.rewardStars").value(1))
                .andExpect(jsonPath("$.totalStars").value(127))
                .andExpect(jsonPath("$.taskBoard.tasks[?(@.code=='mistake-review')].rewardClaimed").value(org.hamcrest.Matchers.hasItem(true)));

        mockMvc.perform(post("/api/daily-tasks/mistake-review/claim")
                        .header("X-Child-Profile-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskCode").value("mistake-review"))
                .andExpect(jsonPath("$.claimed").value(false))
                .andExpect(jsonPath("$.alreadyClaimed").value(true))
                .andExpect(jsonPath("$.rewardStars").value(0))
                .andExpect(jsonPath("$.totalStars").value(127))
                .andExpect(jsonPath("$.taskBoard.tasks[?(@.code=='mistake-review')].rewardClaimed").value(org.hamcrest.Matchers.hasItem(true)));
    }

    @Test
    @Transactional
    void shouldReturnMistakeReviewCenterWithTargetLevelOrExistingMistake() throws Exception {
        mockMvc.perform(patch("/api/parent/children/3")
                        .header("X-Parent-Account-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nickname": "小海豚",
                                  "title": "海湾领航员",
                                  "stageLabel": "四年级",
                                  "avatarColor": "#8ee1b5"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/levels/math-grade4-decimal-001/complete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "childProfileId": 3,
                                  "correctCount": 0,
                                  "wrongCount": 2,
                                  "durationSeconds": 180
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/mistakes/review").header("X-Child-Profile-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.childNickname").value("小海豚"))
                .andExpect(jsonPath("$.totalMistakes").value(org.hamcrest.Matchers.greaterThan(0)))
                .andExpect(jsonPath("$.readyToMasterCount").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.items[0].levelCode").value(org.hamcrest.Matchers.anyOf(
                        org.hamcrest.Matchers.is("math-grade4-decimal-001"),
                        org.hamcrest.Matchers.is("math-numbers-002")
                )))
                .andExpect(jsonPath("$.items[0].masteryStatus").value("接近掌握"))
                .andExpect(jsonPath("$.items[0].reviewSteps.length()").value(org.hamcrest.Matchers.greaterThan(0)));
    }

    @Test
    @Transactional
    void shouldSubmitMistakeReviewAndMarkKnowledgePointMastered() throws Exception {
        mockMvc.perform(patch("/api/parent/children/3")
                        .header("X-Parent-Account-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nickname": "小海豚",
                                  "title": "海湾领航员",
                                  "stageLabel": "四年级",
                                  "avatarColor": "#8ee1b5"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/levels/math-grade4-decimal-001/complete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "childProfileId": 3,
                                  "correctCount": 0,
                                  "wrongCount": 2,
                                  "durationSeconds": 180
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/mistakes/review/math-grade4-decimal-001/submit")
                        .header("X-Child-Profile-Id", 3)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "correctCount": 3,
                                  "wrongCount": 0,
                                  "durationSeconds": 120
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.levelCode").value("math-grade4-decimal-001"))
                .andExpect(jsonPath("$.mastered").value(true))
                .andExpect(jsonPath("$.masteryStatus").value("已掌握"))
                .andExpect(jsonPath("$.remainingMistakes").value(0))
                .andExpect(jsonPath("$.reviewCenter.items.length()").value(0));
    }

    @Test
    @Transactional
    void shouldReturnLearningPathWithLockedLevels() throws Exception {
        mockMvc.perform(patch("/api/parent/children/3")
                        .header("X-Parent-Account-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nickname": "小海豚",
                                  "title": "海湾领航员",
                                  "stageLabel": "四年级",
                                  "avatarColor": "#8ee1b5"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/levels/math-grade4-decimal-001/complete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "childProfileId": 3,
                                  "correctCount": 2,
                                  "wrongCount": 0,
                                  "durationSeconds": 180
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/learning-path").header("X-Child-Profile-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stageLabel").value("四年级"))
                .andExpect(jsonPath("$.chapters[0].levels[0].status").value("completed"))
                .andExpect(jsonPath("$.chapters[0].levels[1].status").value("recommended"))
                .andExpect(jsonPath("$.chapters[1].levels[0].status").value("locked"))
                .andExpect(jsonPath("$.chapters[1].levels[0].locked").value(true))
                .andExpect(jsonPath("$.chapters[1].levels[0].lockReason").value("先完成前一站，再解锁这里"));
    }

    @Test
    void shouldReturnContentConfigCatalog() throws Exception {
        mockMvc.perform(get("/api/content/configs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.configuredLevelCount").value(org.hamcrest.Matchers.greaterThan(0)))
                .andExpect(jsonPath("$.totalVariantCount").value(org.hamcrest.Matchers.greaterThan(0)))
                .andExpect(jsonPath("$.items[?(@.levelCode=='math-grade1-hundredchart-001')].knowledgePointTitle")
                        .value(org.hamcrest.Matchers.hasItem("数形结合：百格图认数")))
                .andExpect(jsonPath("$.items[?(@.levelCode=='math-grade2-array-001')].variantCount")
                        .value(org.hamcrest.Matchers.hasItem(10)))
                .andExpect(jsonPath("$.items[?(@.levelCode=='math-grade3-fractionbar-001')].knowledgePointTitle")
                        .value(org.hamcrest.Matchers.hasItem("数形结合：分数条比较")))
                .andExpect(jsonPath("$.items[?(@.levelCode=='math-grade4-hundredths-001')].knowledgePointTitle")
                        .value(org.hamcrest.Matchers.hasItem("数形结合：百分位小数")))
                .andExpect(jsonPath("$.items[?(@.levelCode=='math-grade4-distributive-001')].knowledgePointTitle")
                        .value(org.hamcrest.Matchers.hasItem("运算律：乘法分配律")))
                .andExpect(jsonPath("$.items[?(@.levelCode=='math-grade4-distance-001')].variantCount")
                        .value(org.hamcrest.Matchers.hasItem(10)))
                .andExpect(jsonPath("$.items[?(@.levelCode=='math-grade4-decimal-001')].assetTheme").value(org.hamcrest.Matchers.hasItem("小数灯塔")))
                .andExpect(jsonPath("$.items[?(@.levelCode=='math-grade4-decimal-001')].audioQuality").value(org.hamcrest.Matchers.hasItem(org.hamcrest.Matchers.containsString("TTS"))))
                .andExpect(jsonPath("$.items[?(@.levelCode=='math-grade4-decimal-001')].variantCount").value(org.hamcrest.Matchers.hasItem(6)));
    }

    @Test
    @Transactional
    void shouldReturnStageReportKnowledgeMapAndMistakeReviewPlan() throws Exception {
        mockMvc.perform(patch("/api/parent/children/3")
                        .header("X-Parent-Account-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nickname": "小海豚",
                                  "title": "海湾领航员",
                                  "stageLabel": "四年级",
                                  "avatarColor": "#8ee1b5"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/levels/math-grade4-decimal-001/complete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "childProfileId": 3,
                                  "correctCount": 0,
                                  "wrongCount": 2,
                                  "durationSeconds": 180
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/parent/dashboard").header("X-Child-Profile-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stageReport.stageLabel").value("四年级"))
                .andExpect(jsonPath("$.stageReport.completedLevels").value(1))
                .andExpect(jsonPath("$.stageReport.totalLevels").value(16))
                .andExpect(jsonPath("$.stageReport.completionPercent").value(6))
                .andExpect(jsonPath("$.stageReport.readinessLabel").value("刚刚起步"))
                .andExpect(jsonPath("$.stageReport.nextMilestone").value(org.hamcrest.Matchers.containsString("小数百格图")))
                .andExpect(jsonPath("$.knowledgeMap[0].subjectTitle").value("数学岛"))
                .andExpect(jsonPath("$.knowledgeMap[0].knowledgePointCode").value("math.g4.decimal.tenths"))
                .andExpect(jsonPath("$.knowledgeMap[0].knowledgePointTitle").value("小数初步：十分位"))
                .andExpect(jsonPath("$.knowledgeMap[0].masteryPercent").value(0))
                .andExpect(jsonPath("$.knowledgeMap[0].statusLabel").value("需要复习"))
                .andExpect(jsonPath("$.knowledgeMap[0].nextAction").value(org.hamcrest.Matchers.containsString("小数初步")))
                .andExpect(jsonPath("$.mistakeReviewPlan[0].levelTitle").value("小数点灯塔"))
                .andExpect(jsonPath("$.mistakeReviewPlan[0].knowledgePointTitle").value("小数初步：十分位"))
                .andExpect(jsonPath("$.mistakeReviewPlan[0].mistakeCount").value(2))
                .andExpect(jsonPath("$.mistakeReviewPlan[0].reviewAction").value(org.hamcrest.Matchers.containsString("复习")))
                .andExpect(jsonPath("$.mistakeReviewPlan[0].targetLevelCode").value("math-grade4-decimal-001"));
    }

    @Test
    @Transactional
    void shouldFilterCurriculumByChildStage() throws Exception {
        mockMvc.perform(patch("/api/parent/children/2")
                        .header("X-Parent-Account-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nickname": "小火箭",
                                  "title": "银河探险家",
                                  "stageLabel": "一年级",
                                  "avatarColor": "#8ad1ff"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stageLabel").value("一年级"));

        mockMvc.perform(get("/api/home/overview").header("X-Child-Profile-Id", 2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nextLevelCode").value("math-grade1-numbers-001"))
                .andExpect(jsonPath("$.nextLevelTitle").value("认识 100 以内的数"));

        mockMvc.perform(get("/api/subjects/math/map").header("X-Child-Profile-Id", 2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chapters[0].code").value("math-grade1-numbers"))
                .andExpect(jsonPath("$.chapters[0].title").value("百数启航站"))
                .andExpect(jsonPath("$.chapters[0].levels[0].code").value("math-grade1-numbers-001"))
                .andExpect(jsonPath("$.chapters[0].levels[0].status").value("recommended"))
                .andExpect(jsonPath("$.chapters[1].code").value("math-grade1-life"))
                .andExpect(jsonPath("$.chapters[1].levels[1].code").value("math-grade1-wordproblem-001"))
                .andExpect(jsonPath("$.chapters[1].levels[2].code").value("math-grade1-money-001"))
                .andExpect(jsonPath("$.chapters[1].levels[3].code").value("math-grade1-time-001"))
                .andExpect(jsonPath("$.chapters[1].levels[4].code").value("math-grade1-shape-001"));

        mockMvc.perform(get("/api/subjects/chinese/map").header("X-Child-Profile-Id", 2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chapters[0].code").value("chinese-grade1-words"))
                .andExpect(jsonPath("$.chapters[0].levels[2].code").value("chinese-grade1-finals-001"))
                .andExpect(jsonPath("$.chapters[0].levels[3].code").value("chinese-grade1-measure-word-001"))
                .andExpect(jsonPath("$.chapters[1].levels[2].code").value("chinese-grade1-picture-speaking-001"));

        mockMvc.perform(get("/api/subjects/english/map").header("X-Child-Profile-Id", 2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chapters[0].code").value("english-grade1-words"))
                .andExpect(jsonPath("$.chapters[0].levels[2].code").value("english-grade1-short-vowel-001"))
                .andExpect(jsonPath("$.chapters[0].levels[3].code").value("english-grade1-number-color-001"))
                .andExpect(jsonPath("$.chapters[1].levels[2].code").value("english-grade1-dialogue-001"));
    }

    @Test
    @Transactional
    void shouldFilterCurriculumBySecondGradeStage() throws Exception {
        mockMvc.perform(patch("/api/parent/children/3")
                        .header("X-Parent-Account-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nickname": "小海豚",
                                  "title": "海湾领航员",
                                  "stageLabel": "二年级",
                                  "avatarColor": "#8ee1b5"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stageLabel").value("二年级"));

        mockMvc.perform(get("/api/home/overview").header("X-Child-Profile-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nextLevelCode").value("math-grade2-multiply-001"))
                .andExpect(jsonPath("$.nextLevelTitle").value("表内乘法起步"));

        mockMvc.perform(get("/api/subjects/math/map").header("X-Child-Profile-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chapters[0].code").value("math-grade2-skills"))
                .andExpect(jsonPath("$.chapters[0].title").value("乘法巧思站"))
                .andExpect(jsonPath("$.chapters[0].levels[0].code").value("math-grade2-multiply-001"))
                .andExpect(jsonPath("$.chapters[0].levels[1].code").value("math-grade2-array-001"))
                .andExpect(jsonPath("$.chapters[0].levels[2].code").value("math-grade2-length-001"))
                .andExpect(jsonPath("$.chapters[0].levels[3].code").value("math-grade2-division-001"))
                .andExpect(jsonPath("$.chapters[0].levels[4].code").value("math-grade2-statistics-001"))
                .andExpect(jsonPath("$.chapters[1].code").value("math-grade2-life"))
                .andExpect(jsonPath("$.chapters[1].levels[1].code").value("math-grade2-bar-model-001"))
                .andExpect(jsonPath("$.chapters[1].levels[2].code").value("math-grade2-time-001"));

        mockMvc.perform(get("/api/subjects/chinese/map").header("X-Child-Profile-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chapters[0].code").value("chinese-grade2-words"))
                .andExpect(jsonPath("$.chapters[0].levels[2].code").value("chinese-grade2-punctuation-001"))
                .andExpect(jsonPath("$.chapters[1].code").value("chinese-grade2-reading"))
                .andExpect(jsonPath("$.chapters[1].levels[2].code").value("chinese-grade2-main-idea-001"));

        mockMvc.perform(get("/api/subjects/english/map").header("X-Child-Profile-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chapters[0].code").value("english-grade2-phonics"))
                .andExpect(jsonPath("$.chapters[0].levels[2].code").value("english-grade2-food-listening-001"))
                .andExpect(jsonPath("$.chapters[1].code").value("english-grade2-story"))
                .andExpect(jsonPath("$.chapters[1].levels[2].code").value("english-grade2-animal-dialogue-001"));
    }

    @Test
    @Transactional
    void shouldFilterCurriculumByThirdGradeStage() throws Exception {
        mockMvc.perform(patch("/api/parent/children/2")
                        .header("X-Parent-Account-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nickname": "小火箭",
                                  "title": "银河探险家",
                                  "stageLabel": "三年级",
                                  "avatarColor": "#8ad1ff"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stageLabel").value("三年级"));

        mockMvc.perform(get("/api/home/overview").header("X-Child-Profile-Id", 2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nextLevelCode").value("math-grade3-division-001"))
                .andExpect(jsonPath("$.nextLevelTitle").value("除法平均分"));

        mockMvc.perform(get("/api/subjects/english/map").header("X-Child-Profile-Id", 2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chapters[0].code").value("english-grade3-sentences"))
                .andExpect(jsonPath("$.chapters[0].levels[0].code").value("english-grade3-transform-001"))
                .andExpect(jsonPath("$.chapters[1].code").value("english-grade3-reading"))
                .andExpect(jsonPath("$.chapters[1].levels[1].code").value("english-grade3-topic-001"));
    }

    @Test
    @Transactional
    void shouldFilterCurriculumByFourthGradeStage() throws Exception {
        mockMvc.perform(patch("/api/parent/children/3")
                        .header("X-Parent-Account-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nickname": "小海豚",
                                  "title": "海湾领航员",
                                  "stageLabel": "四年级",
                                  "avatarColor": "#8ee1b5"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stageLabel").value("四年级"));

        mockMvc.perform(get("/api/home/overview").header("X-Child-Profile-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nextLevelCode").value("math-grade4-decimal-001"))
                .andExpect(jsonPath("$.nextLevelTitle").value("小数初步"));

        mockMvc.perform(get("/api/subjects/chinese/map").header("X-Child-Profile-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chapters[0].code").value("chinese-grade4-reading"))
                .andExpect(jsonPath("$.chapters[0].levels[0].code").value("chinese-grade4-passage-001"))
                .andExpect(jsonPath("$.chapters[1].code").value("chinese-grade4-expression"))
                .andExpect(jsonPath("$.chapters[1].levels[1].code").value("chinese-grade4-grammar-001"));
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
    void shouldReturnExpandedPreschoolMathThinkingLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/math-subitizing-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("math-subitizing-001"))
                .andExpect(jsonPath("$.steps[0].type").value("tap-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("数学数感：快速看数量"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("number-choice")));

        mockMvc.perform(get("/api/levels/math-part-whole-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("math-part-whole-001"))
                .andExpect(jsonPath("$.steps[0].type").value("equation-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("数学数感：数的分合"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("数字分合小屋")));

        mockMvc.perform(get("/api/levels/math-picture-addition-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("math-picture-addition-001"))
                .andExpect(jsonPath("$.steps[0].type").value("story-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("数学运算：看图加法"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("4 + 3 = 7")));
    }

    @Test
    void shouldReturnExpandedGradeOneMathLifeLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/math-grade1-money-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("math-grade1-money-001"))
                .andExpect(jsonPath("$.steps[0].type").value("tap-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("一年级生活数学：人民币初步"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("人民币小商店")));

        mockMvc.perform(get("/api/levels/math-grade1-time-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("math-grade1-time-001"))
                .andExpect(jsonPath("$.steps[0].type").value("story-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("一年级生活数学：整点时间"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("整点时钟")));

        mockMvc.perform(get("/api/levels/math-grade1-shape-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("math-grade1-shape-001"))
                .andExpect(jsonPath("$.steps[0].type").value("tap-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("一年级图形应用：图形拼组"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("长方形")));
    }

    @Test
    void shouldReturnExpandedGradeOneLanguageLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/chinese-grade1-finals-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("chinese-grade1-finals-001"))
                .andExpect(jsonPath("$.steps[0].type").value("listen-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("一年级拼音：复韵母听辨"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("播放韵母")));

        mockMvc.perform(get("/api/levels/chinese-grade1-measure-word-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("chinese-grade1-measure-word-001"))
                .andExpect(jsonPath("$.steps[0].type").value("tap-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("一年级词语：量词搭配"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("一条小鱼")));

        mockMvc.perform(get("/api/levels/chinese-grade1-picture-speaking-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("chinese-grade1-picture-speaking-001"))
                .andExpect(jsonPath("$.steps[0].type").value("sentence-read"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("一年级表达：看图说话"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("早上，小明来到学校")));

        mockMvc.perform(get("/api/levels/english-grade1-short-vowel-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-grade1-short-vowel-001"))
                .andExpect(jsonPath("$.steps[0].type").value("listen-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("一年级英语：短元音听辨"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("cat")));

        mockMvc.perform(get("/api/levels/english-grade1-number-color-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-grade1-number-color-001"))
                .andExpect(jsonPath("$.steps[0].type").value("drag-match"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("一年级英语：数字颜色词"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("one")));

        mockMvc.perform(get("/api/levels/english-grade1-dialogue-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-grade1-dialogue-001"))
                .andExpect(jsonPath("$.steps[0].type").value("sentence-read"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("一年级英语：课堂日常表达"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("Open your book")));
    }

    @Test
    void shouldReturnExpandedGradeTwoMaturityLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/math-grade2-division-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("math-grade2-division-001"))
                .andExpect(jsonPath("$.steps[0].type").value("story-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("二年级运算：平均分除法"))
                .andExpect(jsonPath("$.steps[0].variantCount").value(8))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("平均分餐桌")));

        mockMvc.perform(get("/api/levels/math-grade2-statistics-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("math-grade2-statistics-001"))
                .andExpect(jsonPath("$.steps[0].type").value("tap-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("二年级统计：读图比较"))
                .andExpect(jsonPath("$.steps[0].variantCount").value(8))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("香蕉有 8 个")));

        mockMvc.perform(get("/api/levels/chinese-grade2-punctuation-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("chinese-grade2-punctuation-001"))
                .andExpect(jsonPath("$.steps[0].type").value("tap-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("二年级表达：标点语气"))
                .andExpect(jsonPath("$.steps[0].variantCount").value(8))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("问号")));

        mockMvc.perform(get("/api/levels/chinese-grade2-main-idea-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("chinese-grade2-main-idea-001"))
                .andExpect(jsonPath("$.steps[0].type").value("tap-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("二年级阅读：中心句初步"))
                .andExpect(jsonPath("$.steps[0].variantCount").value(6))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("小松鼠很勤劳")));

        mockMvc.perform(get("/api/levels/english-grade2-food-listening-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-grade2-food-listening-001"))
                .andExpect(jsonPath("$.steps[0].type").value("listen-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("二年级英语：食物词听辨"))
                .andExpect(jsonPath("$.steps[0].variantCount").value(8))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("播放食物单词")));

        mockMvc.perform(get("/api/levels/english-grade2-animal-dialogue-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-grade2-animal-dialogue-001"))
                .andExpect(jsonPath("$.steps[0].type").value("sentence-read"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("二年级英语：动物主题对话"))
                .andExpect(jsonPath("$.steps[0].variantCount").value(6))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("Do you like cats?")));
    }

    @Test
    void shouldReturnOlympiadTrainingLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/olympiad-g4-chicken-rabbit-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("olympiad-g4-chicken-rabbit-001"))
                .andExpect(jsonPath("$.subjectTitle").value("奥数训练营"))
                .andExpect(jsonPath("$.steps[0].type").value("story-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointCode").value("olympiad.g4.chicken-rabbit"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("四年级奥数：鸡兔同笼"))
                .andExpect(jsonPath("$.steps[0].variantCount").value(8));
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
    void shouldReturnExpandedEnglishSpeakingLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/english-letter-sounds-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-letter-sounds-001"))
                .andExpect(jsonPath("$.steps[0].type").value("follow-read"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("英语字母：字母音跟读"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("A, /a/, apple")));

        mockMvc.perform(get("/api/levels/english-word-sounds-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-word-sounds-001"))
                .andExpect(jsonPath("$.steps[0].type").value("listen-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("英语单词：日常单词读音"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("播放单词读音")));

        mockMvc.perform(get("/api/levels/english-daily-sentences-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-daily-sentences-001"))
                .andExpect(jsonPath("$.steps[0].type").value("sentence-read"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("英语口语：日常短句跟读"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("Good morning.")));
    }

    @Test
    void shouldReturnAdditionalEnglishSpeakingLevelDetails() throws Exception {
        mockMvc.perform(get("/api/levels/english-letter-sounds-002"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-letter-sounds-002"))
                .andExpect(jsonPath("$.steps[0].type").value("follow-read"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("英语字母：D 到 F 字母音"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("D, /d/, dog")));

        mockMvc.perform(get("/api/levels/english-word-sounds-002"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-word-sounds-002"))
                .andExpect(jsonPath("$.steps[0].type").value("listen-choice"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("英语单词：生活物品听辨"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("播放生活单词")));

        mockMvc.perform(get("/api/levels/english-dialogue-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("english-dialogue-001"))
                .andExpect(jsonPath("$.steps[0].type").value("sentence-read"))
                .andExpect(jsonPath("$.steps[0].knowledgePointTitle").value("英语口语：问候对话"))
                .andExpect(jsonPath("$.steps[0].activityConfigJson").value(org.hamcrest.Matchers.containsString("How are you?")));
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
                .andExpect(jsonPath("$.reward.badgeName").value("数字小达人"))
                .andExpect(jsonPath("$.leaderboardFeedback.boardTitle").value("本周星星榜"))
                .andExpect(jsonPath("$.leaderboardFeedback.rankBefore").value(3))
                .andExpect(jsonPath("$.leaderboardFeedback.rankAfter").value(3))
                .andExpect(jsonPath("$.leaderboardFeedback.trendLabel").value("稳定第 3 名"))
                .andExpect(jsonPath("$.leaderboardFeedback.message").value(org.hamcrest.Matchers.containsString("星光榜")));
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
                .andExpect(jsonPath("$.subjectInsights[0].totalLevels").value(17))
                .andExpect(jsonPath("$.subjectInsights[0].accuracyPercent").value(75))
                .andExpect(jsonPath("$.subjectInsights[0].nextLevelReason").isNotEmpty())
                .andExpect(jsonPath("$.recentActivities[0].subjectTitle").value("语文岛"))
                .andExpect(jsonPath("$.siblingComparisons.length()").value(3))
                .andExpect(jsonPath("$.siblingComparisons[0].childNickname").value("小星星"))
                .andExpect(jsonPath("$.siblingComparisons[0].activeChild").value(true))
                .andExpect(jsonPath("$.siblingComparisons[1].childNickname").value("小火箭"))
                .andExpect(jsonPath("$.siblingComparisons[1].weeklyStars").isNumber())
                .andExpect(jsonPath("$.siblingComparisons[1].statusLabel").isNotEmpty());
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
