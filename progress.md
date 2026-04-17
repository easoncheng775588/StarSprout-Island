# Progress

## 2026-04-13

- 完成 PRD 文档
- 完成信息架构与页面原型说明
- 完成数据库设计草案
- 完成环境检查
- 正在创建实施计划与工程骨架
- 恢复中断现场，确认测试骨架已创建
- 定位到依赖下载受沙箱网络与默认缓存目录限制
- 前端测试通过：`npm test`
- 前端打包通过：`npm run build`
- 后端测试通过：`mvn -Dmaven.repo.local=/Users/easoncheng/Documents/New project/.cache/m2 test`
- 后端打包通过：`mvn -Dmaven.repo.local=/Users/easoncheng/Documents/New project/.cache/m2 package`
- 补充项目 README 与运行说明
- 前端改为通过 `/api` 调用真实后端接口
- Vite 已配置本地开发代理到 `http://localhost:8080`
- 新增家长中心页与排行榜页
- 新增后端 `GET /api/parent/dashboard` 与 `GET /api/leaderboard/weekly`
- 前端测试通过：`npm test`，共 6 项测试
- 前端打包通过：`npm run build`
- 后端测试通过：`mvn -Dmaven.repo.local=/Users/easoncheng/Documents/New project/.cache/m2 test`
- subagents 尝试执行时因供应商 503 熔断失败，已切回主线程继续完成
- 首页新增家长中心与排行榜显式入口
- 前端测试通过：`npm test`，共 7 项测试
- 前端打包通过：`npm run build`
- 后端新增 JPA 实体、Repository、H2 种子数据与 MySQL profile
- 新增持久化回归测试：`PersistenceBackedGameContentServiceTest`
- 后端测试通过：`mvn -Dmaven.repo.local=/Users/easoncheng/Documents/New project/.cache/m2 test`，共 9 项测试
- 关卡页已从纯文案卡升级为玩法配置驱动渲染
- 数学关卡补充了真实苹果/篮子交互与数字石牌操作
- 新增语文与英语关卡互动测试：识字选择、拼音听辨、字母跟读、单词配对
- 前端测试通过：`npm test`，共 11 项测试
- 前端打包通过：`npm run build`

## 2026-04-14

- 拼音播放已改为实际调用浏览器语音，并优先选择更合适的中英文 voice
- 英语岛已增强字母跟读与单词配对反馈
- 新增数学规律关 `math-thinking-001`
- 新增语文笔顺关 `chinese-strokes-001`
- 新增英语绘本跟读关 `english-story-001`
- 关卡地图与后端种子数据已同步扩展到 9 个关卡
- 新增前端回归测试：`core-level-expansion.test.tsx`
- 前端测试通过：`npm test`，共 14 项测试
- 前端打包通过：`npm run build`
- 后端测试通过：`mvn -Dmaven.repo.local=/Users/easoncheng/Documents/New project/.cache/m2 test`，共 10 项测试
- 新增数学减法关 `math-subtraction-001`
- 新增数学数量比较关 `math-compare-001`
- 数学岛地图与后端种子数据已同步扩展到 5 个数学关卡
- 新增前端回归测试：`math-level-expansion.test.tsx`
- 前端测试通过：`npm test`，共 16 项测试
- 前端打包通过：`npm run build`
- 后端测试通过：`mvn -Dmaven.repo.local=/Users/easoncheng/Documents/New project/.cache/m2 test`，共 11 项测试

## 2026-04-17

- 用户已将目标从“幼小衔接打磨”升级为“一年级到四年级持续扩展”
- 新阶段执行策略确定为：
  - 先补课程按 `stageLabel` 过滤的底座
  - 再按一年级、二年级、三年级、四年级逐阶段补内容
  - 每个阶段都要带测试与提交
- 已完成现状盘点：
  - 数学 11 关
  - 语文 9 关
  - 英语 12 关
  - 当前仍属单阶段课程结构
- 本轮开始进入“学段化课程底座 + 一年级 MVP”开发
