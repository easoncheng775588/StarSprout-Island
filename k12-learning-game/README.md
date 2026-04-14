# K12 Learning Game MVP

一个面向幼小衔接阶段儿童的学习类游戏 Web 应用骨架工程。

## 技术栈

- 前端：React + TypeScript + Vite + Vitest
- 后端：Spring Boot 3 + Java 17 + Maven
- 数据：Spring Data JPA + H2（默认开发/测试）+ MySQL（生产 profile）
- 测试：React Testing Library + Spring MockMvc

## 当前已完成

- 儿童端主世界首页
- 学科地图页
- 关卡播放页
- 关卡完成奖励反馈
- 家长中心页
- 排行榜页
- 首页已增加家长中心与排行榜显式入口
- 后端健康检查接口
- 首页概览接口
- 学科地图接口
- 关卡详情接口
- 关卡完成接口
- 家长中心接口
- 周排行榜接口
- 前端已切换为真实 API 取数
- Vite 开发代理已接到 `http://localhost:8080`
- 后端内容与成长数据已迁移为 JPA 实体和种子数据
- 前端自动化测试
- 后端自动化测试

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

## 已提供接口

- `GET /api/health`
- `GET /api/home/overview`
- `GET /api/subjects/{subjectCode}/map`
- `GET /api/levels/{levelCode}`
- `POST /api/levels/{levelCode}/complete`
- `GET /api/parent/dashboard`
- `GET /api/leaderboard/weekly`

## 下一步建议

- 增加首批关卡配置后台和 JSON Schema
- 为家长中心和排行榜补真实端到端联调测试
- 把默认 H2 种子数据进一步外置成可运营维护的内容配置
