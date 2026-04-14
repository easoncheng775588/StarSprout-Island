package com.example.k12learninggame;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
                .andExpect(jsonPath("$.subjects[0].code").value("math"));
    }

    @Test
    void shouldReturnSubjectMap() throws Exception {
        mockMvc.perform(get("/api/subjects/math/map"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subject.code").value("math"))
                .andExpect(jsonPath("$.chapters[0].levels[0].code").value("math-numbers-001"))
                .andExpect(jsonPath("$.chapters[0].levels[2].code").value("math-thinking-001"))
                .andExpect(jsonPath("$.chapters[0].levels[3].code").value("math-subtraction-001"))
                .andExpect(jsonPath("$.chapters[0].levels[4].code").value("math-compare-001"))
                .andExpect(jsonPath("$.chapters[0].levels[5].code").value("math-equation-001"))
                .andExpect(jsonPath("$.chapters[0].levels[6].code").value("math-wordproblem-001"));
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
        mockMvc.perform(get("/api/parent/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.childNickname").value("小星星"))
                .andExpect(jsonPath("$.todaySummary.completedLevels").value(3))
                .andExpect(jsonPath("$.subjectProgress[0].subjectCode").value("math"))
                .andExpect(jsonPath("$.weakPoints[0].title").value("20 以内减法需要多练习"))
                .andExpect(jsonPath("$.settings.leaderboardEnabled").value(true));
    }

    @Test
    void shouldReturnWeeklyLeaderboard() throws Exception {
        mockMvc.perform(get("/api/leaderboard/weekly"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.boardType").value("weekly_star"))
                .andExpect(jsonPath("$.myRank.nickname").value("小星星"))
                .andExpect(jsonPath("$.topPlayers[0].rank").value(1))
                .andExpect(jsonPath("$.nearbyPlayers[1].nickname").value("小星星"));
    }
}
