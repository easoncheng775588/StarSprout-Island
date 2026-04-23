# Next Product Maturity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 把 StarSprout Island 从“内容丰富的 MVP”继续推进到更接近正式产品的学习闭环，重点补课程运营化、题库标准化、复习闭环、家长报告、素材音频和质量保障。

**Architecture:** 下一阶段不优先新增复杂数据库表，而是优先把现有 `subjects`、`chapters`、`levels`、`level_steps`、`level_completions`、`fluency_attempts` 的价值吃透。课程内容继续使用稳定 code，玩法配置继续从 `level_steps.activity_config_json` 演进，只有当需要长期历史、审核流或运营协作时再新增表。

**Tech Stack:** React + Vite + TypeScript, Spring Boot 3 + Java 17, JPA, H2/MySQL profile, Vitest, Spring MockMvc/JUnit。

---

## Product Direction

当前 1-50 项已完成，产品已经具备幼小衔接到四年级 MVP、奥数入口、家长中心、成就墙、排行榜、每日任务、错题复习、学习路径、题库配置健康检查、能力测评、结构化数学小课和数感快练洞察。

下个阶段应避免继续只堆关卡数量，优先补“正式产品的稳定能力”：

- 课程内容可以被检查、预览、逐步运营，而不是只靠 `data.sql` 和前端兜底。
- 快练和题库可以从前端硬编码下沉到后端配置。
- 错题、薄弱点、每日任务、周报能形成同一套知识点闭环。
- 家长端从“看到数据”升级到“看到变化、知道怎么陪练”。
- 孩子端从“完成一关”升级到“完成一节课、一个单元、一个阶段”。
- 素材和音频体验继续提升，但不先引入重型素材平台。

## Phase 51: P0 题库配置中心可编辑 MVP

**User Value:** 运营或开发可以在页面内查看并轻量编辑关卡玩法配置，减少每次补题都要改代码的成本。

**Scope:**
- 后端新增读取单关配置详情接口，返回关卡、步骤、知识点、题型配置、健康提示。
- 后端新增更新 `level_steps.activity_config_json`、`knowledge_point_code`、`knowledge_point_title`、`variant_count` 的接口。
- 前端题库配置中心支持进入单关配置详情页。
- 配置详情页提供 JSON 编辑区、健康检查结果、保存反馈和回退提示。
- 仅支持管理员式本地 MVP，不做权限、审核流和多人协作。

**Files Likely Touched:**
- `backend/src/main/java/com/example/k12learninggame/api/GameController.java`
- `backend/src/main/java/com/example/k12learninggame/service/GameContentService.java`
- `backend/src/main/java/com/example/k12learninggame/domain/LevelStepEntity.java`
- `backend/src/main/java/com/example/k12learninggame/dto/*ContentConfig*.java`
- `frontend/src/pages/ContentConfigCatalog.tsx`
- `frontend/src/api.ts`
- `frontend/src/App.tsx`
- `frontend/src/__tests__/product-engagement.test.tsx`

**Testing:**
- Backend RED: `GET /api/content/configs/{levelCode}` returns 404 before implementation.
- Backend GREEN: detail and update endpoints pass MockMvc assertions.
- Frontend RED: config detail route missing.
- Frontend GREEN: page renders JSON editor, health notes, and save success.

## Phase 52: P0 快练题库后端化

**User Value:** 数感快练题组不再硬编码在前端，可以按学段和题型逐步扩容，家长端题型洞察也能和题源保持一致。

**Scope:**
- 新增后端 `GET /api/fluency/practice`，按当前孩子学段返回题组、`focusArea`、题型标签和题目列表。
- 前端 `FluencyPracticePage` 改为优先读取后端题组，失败时保留本地兜底。
- 题目结构先保持轻量：`prompt`、`choices`、`answer`、`focusArea`。
- 暂不新增独立题库表，先把题组作为服务层配置或 `level_steps.activity_config_json` 派生，等题量继续扩大后再抽表。

**Files Likely Touched:**
- `backend/src/main/java/com/example/k12learninggame/dto/FluencyPractice*.java`
- `backend/src/main/java/com/example/k12learninggame/service/GameContentService.java`
- `backend/src/test/java/com/example/k12learninggame/ApiSmokeTest.java`
- `frontend/src/pages/FluencyPracticePage.tsx`
- `frontend/src/api.ts`
- `frontend/src/__tests__/fluency-practice.test.tsx`

**Testing:**
- Backend verifies stage-aware fluency practice payload.
- Frontend verifies page loads backend题组 and submits returned `focusArea`.
- Compatibility test verifies fallback still works when backend endpoint fails.

## Phase 53: P0 知识点复习闭环 2.0

**User Value:** 家长看到的薄弱点、孩子做的错题复习、每日任务推荐能围绕同一个知识点持续闭环。

**Scope:**
- 复习中心从“按关卡错题”升级为“按知识点聚合”。
- 每个知识点卡展示错题次数、最近复习结果、建议复习动作和推荐关卡。
- 每日任务新增“今日薄弱知识点复习”状态，优先推荐最需要复习的知识点。
- 家长端薄弱点陪练计划复用同一套知识点聚合逻辑。
- 仍复用 `level_completions`、`mistake_review_attempts` 和 `level_steps`，不新增知识点表。

**Files Likely Touched:**
- `GameContentService.java`
- `MistakeReviewCenterResponse` and related DTOs
- `DailyTaskBoardResponse` and related DTOs
- `frontend/src/pages/MistakeReviewCenter.tsx`
- `frontend/src/pages/DailyTasksPage.tsx`
- `frontend/src/pages/ParentDashboard.tsx`
- Existing mistake/daily-task tests

**Testing:**
- Backend verifies repeated mistakes across multiple levels roll up to the same knowledge point.
- Frontend verifies review center shows knowledge point cards and daily task links to review flow.

## Phase 54: P1 学习路径单元化与阶段闯关

**User Value:** 孩子不只是看到一串关卡，而是看到“单元目标 -> 当前小课 -> 单元测验 -> 阶段证书”的成长路线。

**Scope:**
- 学习路径页按章节展示单元目标、完成度、推荐下一关。
- 每个章节末尾生成“单元小测”入口，MVP 可复用现有关卡题型和轻量测评逻辑。
- 章节完成后显示阶段鼓励动画和证书进度提示。
- 不新增单元表，先复用 `chapters` 和 `levels.display_order`。

**Files Likely Touched:**
- `LearningPathResponse` related DTOs
- `GameContentService.java`
- `frontend/src/pages/LearningPathPage.tsx`
- `frontend/src/components/LessonFlowPanel.tsx`
- `frontend/src/__tests__/product-engagement.test.tsx`

**Testing:**
- Backend verifies chapter progress and unit checkpoint fields.
- Frontend verifies unit cards, checkpoint CTA, and completed chapter state.

## Phase 55: P1 家长端阶段报告增强

**User Value:** 家长可以看到最近 4 周趋势、知识点变化和陪练是否有效，而不只是本周摘要。

**Scope:**
- 家长端新增“阶段趋势”面板：最近 4 周学习分钟、完成关卡、平均准确率、快练次数。
- 周报新增“本周变化”：比上周多/少练了多少、正确率变化。
- 薄弱点行动计划显示“已复习/待复习/已掌握”状态。
- 继续复用现有学习记录和复习记录，不新增报表快照表。

**Files Likely Touched:**
- `ParentDashboardResponse` related DTOs
- `GameContentService.java`
- `frontend/src/pages/ParentDashboard.tsx`
- `frontend/src/styles.css`
- `parent-dashboard.test.tsx`

**Testing:**
- Backend verifies trend buckets and week-over-week copy.
- Frontend verifies report renders with empty-state and active-data states.

## Phase 56: P1 素材与音频体验升级 MVP

**User Value:** 孩子端听感和视觉反馈更像正式儿童产品，家长也能看到素材质量正在逐步提升。

**Scope:**
- 扩展 `learningAudio`，支持 `recordedAssetUrl` 优先播放，TTS 作为兜底。
- 关卡配置允许为听辨、跟读、动画讲解步骤声明录音素材 URL。
- 题库配置中心健康检查识别“真实音频缺失 / TTS 兜底 / 录音可用”。
- 前端音频控件显示更友好的播放状态、失败兜底和重播按钮。
- 先使用本地静态 asset 或配置 URL，不接第三方素材库。

**Files Likely Touched:**
- `frontend/src/learningAudio.ts`
- `frontend/src/components/AudioModeControls.tsx`
- `frontend/src/pages/LevelPlayer.tsx`
- `backend/src/main/resources/data.sql`
- Content config health DTO/service
- `learning-audio.test.ts`
- `audio-mode-controls.test.tsx`

**Testing:**
- Unit tests verify recorded audio plan has priority over TTS.
- UI tests verify fallback copy appears when recorded playback is unavailable.

## Phase 57: P1 账号体系与孩子档案打磨

**User Value:** 家长账号、孩子档案、年级切换和隐私设置更像正式产品，降低试用时的混乱感。

**Scope:**
- 登录页增加演示账号说明和新建孩子后的下一步引导。
- 孩子档案新增学习目标偏好：轻松、标准、挑战。
- 家长设置中增加排行榜参与、提醒、每日时长、练习强度统一入口。
- 学习推荐和每日任务根据练习强度调整文案与目标数量。
- 暂不做 JWT、短信、真实密码加密；当前仍是本地演示账号体系。

**Files Likely Touched:**
- Auth/session DTOs
- `ParentSettingsEntity`
- `LoginPage`, `ChildProfile` related components
- `HomeWorld.tsx`
- `DailyTasksPage.tsx`
- `app-shell.test.tsx`

**Testing:**
- Backend verifies settings persistence.
- Frontend verifies new profile preference changes home/daily task copy.

## Phase 58: P2 奥数训练营成熟化

**User Value:** 奥数板块从“入口和少量关卡”升级为一年级到六年级都有清晰主题、模型讲解和挑战反馈。

**Scope:**
- 每个年级补 2-3 个代表模型：找规律、巧算、枚举、图形分割、线段图、周期、和差倍、行程、数论启蒙。
- 奥数关卡统一展示“模型讲解 -> 例题探索 -> 变式挑战 -> 思维总结”。
- 家长端新增奥数思维维度：观察、枚举、建模、推理。
- 先复用现有 `olympiad` subject、chapters、levels，不新增奥数专用表。

**Files Likely Touched:**
- `backend/src/main/resources/data.sql`
- `LevelPlayer.tsx`
- `MathModelBoard.tsx`
- `olympiad-training.test.tsx`
- Backend smoke tests for olympiad maps/details

**Testing:**
- Frontend verifies each grade path and representative interactions.
- Backend verifies olympiad subject map includes grade 1-6 model coverage.

## Phase 59: P2 内容质量与发布前检查

**User Value:** 产品在演示和试用时更稳定，减少空白页、缺素材、错配置和移动端排版问题。

**Scope:**
- 增加内容质量脚本或测试，检查所有 level 都有 title、description、step、knowledge point、activity config health。
- 增加响应式和 rem 规范测试，防止新增样式回到固定 px。
- 增加关键路由 smoke test：home、subject map、level player、parent、achievement、daily task、config center。
- 输出“发布前检查清单”页面或文档。

**Files Likely Touched:**
- `frontend/src/__tests__/responsive-scale.test.ts`
- `backend/src/test/java/com/example/k12learninggame/ApiSmokeTest.java`
- `k12-learning-game/docs/plans/*`
- Potential new `content-quality.test.ts`

**Testing:**
- Full frontend test/build and backend test must pass after every phase.
- Content quality tests should fail on missing activity config or invalid route.

## Phase 60: P2 可演示数据与种子账号整理

**User Value:** 任何人打开本地环境后都能快速看到幼小衔接、一年级、二年级、三四年级、家长端、快练趋势和奥数板块的完整演示效果。

**Scope:**
- 整理 `data.sql` 演示账号和孩子档案，让不同孩子覆盖不同年级和学习状态。
- README 增加演示账号、推荐查看路线和页面说明。
- 家长端预置更多快练、错题、完成记录，让图表和报告不是空状态。
- 保留测试可控性，避免种子数据让现有断言不稳定。

**Files Likely Touched:**
- `backend/src/main/resources/data.sql`
- `README.md`
- Backend tests relying on seed data
- Parent dashboard tests if demo metrics change

**Testing:**
- Backend seed-data smoke test verifies all demo accounts and dashboards load.
- Frontend manual route list can be checked with existing test coverage.

## Recommended Execution Order

1. Phase 51 and 52 first：先把题库配置和快练题源从“硬编码”推进到“可配置”，这是后续扩内容的地基。
2. Phase 53 and 54 second：把复习和学习路径做成闭环，提升孩子端留存。
3. Phase 55 and 56 third：增强家长报告、素材音频，让产品更像正式体验。
4. Phase 57 to 60 last：打磨账号、奥数、质量检查和演示数据，进入可演示版本。

## Definition of Done

每个 phase 完成时必须满足：

- 先写 RED 测试，再实现，再跑 GREEN。
- 前端定向测试通过。
- 后端定向测试通过，如该 phase 涉及后端。
- 前端全量 `npm test -- --run` 通过。
- 前端 `npm run build` 通过。
- 后端 `mvn -q -Dmaven.repo.local='/Users/easoncheng/Documents/New project/.cache/m2' test` 通过。
- 更新 `task_plan.md`、`progress.md`、`findings.md`。
- 单独提交，并推送到 GitHub。
