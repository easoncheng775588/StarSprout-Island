# StarSprout Island

一个面向幼小衔接到四年级主线学习、并带有 1-6 年级奥数训练营的儿童学习游戏 Web 应用。

## 技术栈

- 前端：React + TypeScript + Vite + Vitest
- 后端：Spring Boot 3 + Java 17 + Maven
- 数据：Spring Data JPA + H2（默认开发/测试）+ MySQL（生产 profile）
- 测试：React Testing Library + Spring MockMvc

## 当前能力

- 幼小衔接到四年级的语文、数学、英语主线岛屿
- 1-6 年级奥数训练营入口与代表模型关卡
- 家长中心、阶段报告、4 周趋势、周报打印
- 每日任务、错题复习、学习路径、成就墙、排行榜
- 1 分钟数感快练、分层/题型洞察、知识点复习闭环
- 题库配置中心、配置详情编辑、健康检查
- React/Vite 前端与 Spring Boot/JPA 后端真实联调
- 自动化测试、构建、H2/MySQL 双环境支持

## 演示账号

- `13800000001 / demo1234`
  - `小星星`：适合查看幼小衔接主线、每日任务、基础家长端与排行榜
  - `小火箭`：适合继续看幼小衔接主线里的不同学习状态
  - `小海豚`：适合查看幼小衔接下的另一条演示进度
- `13800000002 / demo5678`
  - `小雨点`：一年级画像，适合查看百数、人民币、课堂对话等低年级路线
  - `小森林`：二年级画像，适合查看除法平均分、统计图、中心句等中低年级路线
  - `小极光`：三年级画像，适合查看面积模型、分数条、段落概括等路线
  - `小流星`：四年级画像，适合查看小数、平行垂直、时态听辨与复习闭环

第二组账号已经覆盖一年级到四年级多孩子档案，适合重点演示家长中心 4 周趋势、快练题型洞察和复习状态联动。

## 推荐演示路线

1. 先用 `13800000001 / demo1234` 登录，看首页、三大学科岛和幼小衔接主线关卡。
2. 打开 `每日任务`、`错题本`、`学习路径`，确认孩子端闭环完整。
3. 切到 `13800000002 / demo5678`，在顶部切换不同年级孩子档案。
4. 进入 `家长中心` 查看阶段报告、4 周趋势、快练分层/题型洞察和复习行动状态。
5. 直接访问 `题库配置` 与 `题库配置详情`，查看配置中心与健康检查。
6. 最后进入 `奥数训练营`，体验 1-6 年级代表模型入口。

## 目录结构

```text
k12-learning-game/
  frontend/
  backend/
```

## 前端运行

```bash
cd frontend
npm install --cache '../../.cache/npm'
npm run dev
```

默认会把 `/api` 请求代理到 `http://localhost:8080`。

## 前端测试与打包

```bash
cd frontend
npm test
npm run build
```

## 后端运行

```bash
cd backend
mvn -Dmaven.repo.local='../../.cache/m2' spring-boot:run
```

如需切换到 MySQL：

```bash
cd backend
mvn -Dmaven.repo.local='../../.cache/m2' spring-boot:run -Dspring-boot.run.profiles=mysql
```

## 后端测试与打包

```bash
cd backend
mvn -Dmaven.repo.local='../../.cache/m2' test
mvn -Dmaven.repo.local='../../.cache/m2' package
```

## 核心接口

- `GET /api/health`
- `GET /api/home/overview`
- `GET /api/subjects/{subjectCode}/map`
- `GET /api/levels/{levelCode}`
- `POST /api/levels/{levelCode}/complete`
- `GET /api/parent/dashboard`
- `GET /api/leaderboard/weekly`
- `GET /api/daily-tasks`
- `GET /api/mistakes/review`
- `GET /api/learning-path`
- `GET /api/content/configs`
- `GET /api/content/configs/{levelCode}`
- `GET /api/fluency/practice`

## 发布前检查

- 发布前检查清单：`docs/plans/2026-04-23-release-readiness-checklist.md`
- 关键要求：两组演示账号可登录、关键路由深链可打开、家长端趋势/快练/复习状态不是空态、前后端自动化验证全部通过

## 开发建议

- 继续把内容配置和快练题组向后端或 CMS 下沉
- 逐步补真实录音素材、动画素材与更高质量的美术资源
- 为关键演示路线补更强的发布前 smoke 与 E2E 检查
