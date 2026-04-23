# Release Readiness Checklist

## Goal

在本地演示或对外试用前，用一份稳定、可重复执行的清单确认 StarSprout Island 的关键路线、演示账号和自动化验证都处于可用状态。

## Demo Accounts

- `13800000001 / demo1234`
  - 适合查看幼小衔接主线、首页、每日任务、基础家长端和排行榜
- `13800000002 / demo5678`
  - 适合查看一年级到四年级多孩子档案切换、家长端 4 周趋势、快练洞察和复习闭环

## Critical Route Matrix

- `/`
  - 首页可正常加载，展示孩子昵称、今日任务、学科入口
- `/subjects/math`
  - 学科地图可正常加载，章节与关卡节点可见
- `/levels/math-numbers-001`
  - 关卡页可正常加载，玩法区域和奖励信息可见
- `/parent`
  - 家长中心可正常加载，周报、阶段趋势、快练洞察可见
- `/daily-tasks`
  - 每日任务页可正常加载，任务卡和跳转按钮可见
- `/fluency`
  - 数感快练页可正常加载，题面与作答按钮可见
- `/assessment`
  - 能力测评页可正常加载，5 道题和推荐路线区块可见
- `/mistakes`
  - 错题本可正常加载，知识点复习卡和复习动作按钮可见
- `/learning-path`
  - 学习路径页可正常加载，章节目标和单元小测入口可见
- `/leaderboard`
  - 排行榜可正常加载，榜单切换和当前排名卡可见
- `/achievements`
  - 成就墙可正常加载，阶段家族和已解锁/进行中徽章可见
- `/content-configs`
  - 题库配置目录可正常加载，健康状态与配置入口可见
- `/content-configs/math-grade4-decimal-001`
  - 配置详情深链可正常加载，JSON 配置区和健康说明可见

## Seed Data Expectations

- `星星妈妈` 账号保留幼小衔接演示路径
- `银河家长` 账号包含一年级、二年级、三年级、四年级 4 个孩子档案
- 至少 2 个演示孩子具备跨 4 周的 `level_completions`
- 至少 1 个演示孩子具备最近 7 天的 `fluency_attempts`
- 至少 1 个演示孩子具备 `mistake_review_attempts`，能展示“已复习待巩固 / 已掌握”状态

## Verification Commands

```bash
cd /Users/easoncheng/Documents/New\ project/k12-learning-game/frontend
npm test -- --run
npm run build
```

```bash
cd /Users/easoncheng/Documents/New\ project/k12-learning-game/backend
mvn -q -Dmaven.repo.local='/Users/easoncheng/Documents/New project/.cache/m2' test
```

## Release Gate

- 前端测试全部通过
- 前端构建通过
- 后端测试全部通过
- 两组演示账号均可登录
- 关键路由深链不会出现空白页
- 家长端周报、4 周趋势、快练洞察、复习行动状态至少有 1 组非空演示数据
