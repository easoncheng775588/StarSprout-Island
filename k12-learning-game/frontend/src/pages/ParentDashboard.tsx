import { useEffect, useState } from 'react';
import { getParentDashboard, normalizeParentDashboardData, type ParentDashboardData, updateParentSettings } from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { Link } from 'react-router-dom';
import { useSession } from '../session';

interface ParentDashboardProps {
  data?: ParentDashboardData;
}

export function ParentDashboard({ data }: ParentDashboardProps) {
  const [dashboard, setDashboard] = useState<ParentDashboardData | null>(data ? normalizeParentDashboardData(data) : null);
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState(data?.settings.dailyStudyMinutes ?? 20);
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(data?.settings.leaderboardEnabled ?? true);
  const [reminderEnabled, setReminderEnabled] = useState(data?.settings.reminderEnabled ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const { session } = useSession();

  useEffect(() => {
    if (data) {
      return;
    }

    getParentDashboard().then(setDashboard);
  }, [data, session?.childProfileId]);

  useEffect(() => {
    if (!dashboard) {
      return;
    }

    setDailyStudyMinutes(dashboard.settings.dailyStudyMinutes);
    setLeaderboardEnabled(dashboard.settings.leaderboardEnabled);
    setReminderEnabled(dashboard.settings.reminderEnabled);
  }, [dashboard]);

  if (!dashboard) {
    return <main className="screen"><p>正在整理孩子今天的学习报告...</p></main>;
  }

  async function handleSaveSettings() {
    setIsSaving(true);
    try {
      const nextSettings = await updateParentSettings({
        leaderboardEnabled,
        dailyStudyMinutes,
        reminderEnabled
      });

      setDashboard((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          settings: nextSettings,
          goalProgress: {
            ...current.goalProgress,
            goalMinutes: nextSettings.dailyStudyMinutes
          }
        };
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handlePrintWeeklyReport() {
    window.print();
  }

  return (
    <main className="screen screen-parent">
      <PageTopBar backLabel="返回首页" backTo="/" />

      <section className="map-header">
        <p className="eyebrow">家长中心</p>
        <h1>{dashboard.childNickname} 的学习小结</h1>
        <p>用一眼能看懂的方式，帮你掌握今天的进度、薄弱点和节奏建议。</p>
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <span className="node-step">今日完成</span>
          <h2>今日完成 {dashboard.todaySummary.completedLevels} 关</h2>
          <p>学习 {dashboard.todaySummary.studyMinutes} 分钟，获得 {dashboard.todaySummary.earnedStars} 颗星星。</p>
        </article>

        <article className="summary-card">
          <span className="node-step">学习建议</span>
          <h2>建议时长 {dashboard.settings.dailyStudyMinutes} 分钟</h2>
          <p>{dashboard.settings.leaderboardEnabled ? '排行榜已开启' : '排行榜已关闭'}</p>
          <p>{dashboard.settings.reminderEnabled ? '连续学习提醒已开启' : '连续学习提醒未开启'}</p>
        </article>

        <article className="summary-card">
          <span className="node-step">今日目标</span>
          <h2>今日目标完成 {dashboard.goalProgress.completionPercent}%</h2>
          <p>已学习 {dashboard.goalProgress.completedMinutes} / {dashboard.goalProgress.goalMinutes} 分钟。</p>
        </article>

        <article className="summary-card">
          <span className="node-step">成就进度</span>
          <h2>已点亮 {dashboard.achievementSummary.unlockedCount} 枚成就徽章</h2>
          <p>{dashboard.achievementSummary.nextMilestone}</p>
        </article>
      </section>

      <section className="weekly-report-sheet" aria-label="本周成长周报">
        <div className="weekly-report-header">
          <div>
            <p className="eyebrow">本周成长周报</p>
            <h2>{dashboard.weeklyReport.title}</h2>
            <span>{dashboard.weeklyReport.dateRangeLabel}</span>
          </div>
          <button className="cta-button cta-button-secondary weekly-report-print" type="button" onClick={handlePrintWeeklyReport}>
            打印/导出周报
          </button>
        </div>
        <p className="weekly-report-summary">{dashboard.weeklyReport.summary}</p>
        <div className="weekly-report-metrics">
          <article>
            <strong>{dashboard.weeklyReport.completedLevels}</strong>
            <span>完成关卡</span>
          </article>
          <article>
            <strong>{dashboard.weeklyReport.studyMinutes}</strong>
            <span>学习分钟</span>
          </article>
          <article>
            <strong>{dashboard.weeklyReport.earnedStars}</strong>
            <span>收集星星</span>
          </article>
          <article>
            <strong>{dashboard.weeklyReport.averageAccuracyPercent}%</strong>
            <span>平均准确率</span>
          </article>
        </div>
        <div className="weekly-report-body">
          <article>
            <span className="node-step">本周亮点</span>
            <p>{dashboard.weeklyReport.highlightText}</p>
          </article>
          <article>
            <span className="node-step">下周重点</span>
            <p>{dashboard.weeklyReport.growthFocus}</p>
          </article>
          <article>
            <span className="node-step">陪伴建议</span>
            <p>{dashboard.weeklyReport.parentAction}</p>
          </article>
        </div>
        <div className="weekly-report-subjects">
          {dashboard.weeklyReport.subjectHighlights.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      {dashboard.stageReport && (
        <section className="panel-card stage-report-card">
          <div>
            <p className="eyebrow">阶段报告</p>
            <h2>{dashboard.stageReport.stageLabel} · {dashboard.stageReport.readinessLabel}</h2>
            <p>{dashboard.stageReport.nextMilestone}</p>
          </div>
          <div className="stage-report-meter" aria-label={`阶段完成度 ${dashboard.stageReport.completionPercent}%`}>
            <strong>{dashboard.stageReport.completionPercent}%</strong>
            <span>已完成 {dashboard.stageReport.completedLevels} / {dashboard.stageReport.totalLevels} 关</span>
            <div className="progress-bar">
              <span style={{ width: `${dashboard.stageReport.completionPercent}%` }} />
            </div>
          </div>
        </section>
      )}

      {dashboard.siblingComparisons.length > 0 && (
        <section className="panel-card sibling-comparison-panel">
          <div className="panel-heading-row">
            <div>
              <p className="eyebrow">多孩子对比</p>
              <h2>看看每个孩子自己的星光节奏</h2>
            </div>
            <p>这里不做压力排名，只帮助家长快速看见谁需要陪伴、谁最近状态很稳。</p>
          </div>
          <div className="sibling-comparison-grid">
            {dashboard.siblingComparisons.map((item) => (
              <article
                className={`sibling-comparison-card${item.activeChild ? ' sibling-comparison-card-active' : ''}`}
                key={item.childNickname}
              >
                <div className="sibling-comparison-card-header">
                  <div>
                    <span>{item.stageLabel}</span>
                    <h3>{item.childNickname}</h3>
                  </div>
                  <strong>{item.statusLabel}</strong>
                </div>
                <p>本周 {item.weeklyStars} 颗星星</p>
                <p>准确率 {item.averageAccuracyPercent}% · 已完成 {item.completedLevels} 关</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="dashboard-grid dashboard-grid-parent-insights">
        <article className="panel-card knowledge-map-panel">
          <p className="eyebrow">知识点掌握图谱</p>
          <div className="knowledge-map-grid">
            {dashboard.knowledgeMap.length > 0 ? dashboard.knowledgeMap.map((item) => (
              <article className="knowledge-node" key={item.knowledgePointCode}>
                <span>{item.subjectTitle}</span>
                <h3>{item.knowledgePointTitle}</h3>
                <p>掌握度 {item.masteryPercent}% · {item.statusLabel}</p>
                <div className="knowledge-mastery-bar">
                  <span style={{ width: `${item.masteryPercent}%` }} />
                </div>
                <strong>{item.nextAction}</strong>
              </article>
            )) : (
              <p>还没有足够数据生成图谱，完成更多关卡后会自动补全。</p>
            )}
          </div>
        </article>

        <article className="panel-card thinking-model-panel">
          <p className="eyebrow">思维模型成长</p>
          <div className="thinking-model-list">
            {(dashboard.thinkingModelProgress ?? []).length > 0 ? dashboard.thinkingModelProgress.map((item) => (
              <article className="thinking-model-card" key={item.modelCode}>
                <div className="thinking-model-card-header">
                  <h3>{item.modelTitle}</h3>
                  <span>{item.progressPercent}%</span>
                </div>
                <p>{item.modelTypeLabel} · {item.completedLevels} / {item.totalLevels} 关</p>
                <div className="knowledge-mastery-bar">
                  <span style={{ width: `${item.progressPercent}%` }} />
                </div>
                <strong>{item.nextAction}</strong>
              </article>
            )) : (
              <p>当前阶段还没有足够的数学模型记录，完成数形结合关卡后会自动生成。</p>
            )}
          </div>
        </article>

        <article className="panel-card mistake-loop-panel">
          <p className="eyebrow">错题复习闭环</p>
          <div className="mistake-review-list">
            {dashboard.mistakeReviewPlan.length > 0 ? dashboard.mistakeReviewPlan.map((item) => (
              <article className="mistake-review-card" key={`${item.targetLevelCode}-${item.knowledgePointTitle}`}>
                <div>
                  <h3>{item.levelTitle}</h3>
                  <p>错题 {item.mistakeCount} 次 · {item.knowledgePointTitle}</p>
                  <span>{item.reviewAction}</span>
                </div>
                <Link className="cta-button cta-button-secondary" to={`/levels/${item.targetLevelCode}`}>
                  去复习{item.levelTitle}
                </Link>
              </article>
            )) : (
              <p>暂时没有错题记录，可以保持现在的轻松节奏。</p>
            )}
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <p className="eyebrow">学科进度</p>
          {dashboard.subjectProgress.map((item) => (
            <div className="progress-row" key={item.subjectCode}>
              <div>
                <strong>{item.subjectTitle}</strong>
                <p>{item.progressPercent}% 已完成</p>
              </div>
              <div className="progress-bar">
                <span style={{ width: `${item.progressPercent}%` }} />
              </div>
            </div>
          ))}
        </article>

        <article className="panel-card">
          <p className="eyebrow">近 7 天趋势</p>
          <div className="trend-strip">
            {dashboard.weeklyTrend.map((point) => (
              <div className="trend-bar" key={point.dayLabel}>
                <span style={{ height: `${Math.max(point.minutes * 0.3, 2.4)}rem` }} />
                <strong>{point.dayLabel}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel-card">
        <p className="eyebrow">薄弱点提醒</p>
        <div className="weak-list">
          {dashboard.weakPoints.map((item) => (
            <article className="weak-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.suggestion}</p>
              <span className="weak-card-reason">{item.reason}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-card weak-action-panel">
        <div className="panel-heading-row">
          <div>
            <p className="eyebrow">薄弱点陪练计划</p>
            <h2>把“哪里不稳”变成今晚能做的一小步</h2>
          </div>
          <p>每条建议都来自错题记录和知识点标签，方便家长用短时间陪练。</p>
        </div>
        <div className="weak-action-grid">
          {(dashboard.weakPointActionPlan ?? []).length > 0 ? dashboard.weakPointActionPlan.map((item) => (
            <article className="weak-action-card" key={`${item.targetLevelCode}-${item.knowledgePointTitle}`}>
              <div className="weak-action-card-header">
                <span>{item.priorityLabel}</span>
                <strong>{item.subjectTitle}</strong>
              </div>
              <h3>{item.knowledgePointTitle}</h3>
              <p>{item.focusReason}</p>
              <div className="weak-action-guide">
                <span>家长陪练话术</span>
                <p>{item.parentGuidance}</p>
              </div>
              <p>{item.practicePlan}</p>
              <Link className="cta-button cta-button-secondary" to={`/levels/${item.targetLevelCode}`}>
                打开陪练关卡
              </Link>
            </article>
          )) : (
            <p>当前没有需要重点陪练的错题点，可以继续保持轻松推进。</p>
          )}
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <p className="eyebrow">家长设置</p>
          <div className="settings-form">
            <label className="settings-field" htmlFor="daily-study-minutes">
              <span>每日目标学习时长</span>
              <input
                id="daily-study-minutes"
                min={5}
                step={5}
                type="number"
                value={dailyStudyMinutes}
                onChange={(event) => setDailyStudyMinutes(Number(event.target.value))}
              />
            </label>

            <label className="settings-toggle" htmlFor="leaderboard-enabled">
              <input
                id="leaderboard-enabled"
                checked={!leaderboardEnabled}
                type="checkbox"
                onChange={(event) => setLeaderboardEnabled(!event.target.checked)}
              />
              <span>关闭排行榜参与</span>
            </label>

            <label className="settings-toggle" htmlFor="reminder-enabled">
              <input
                id="reminder-enabled"
                checked={reminderEnabled}
                type="checkbox"
                onChange={(event) => setReminderEnabled(event.target.checked)}
              />
              <span>开启连续学习提醒</span>
            </label>

            <button
              className="cta-button"
              disabled={isSaving}
              type="button"
              onClick={handleSaveSettings}
            >
              {isSaving ? '正在保存...' : '保存家长设置'}
            </button>
          </div>
        </article>

        <article className="panel-card">
          <p className="eyebrow">推荐下一步</p>
          <div className="action-list">
            {dashboard.recommendedActions.map((item) => (
              <article className="action-chip" key={`${item.targetSubject}-${item.title}`}>
                <strong>{item.title}</strong>
                <p>{item.reason}</p>
                <span>{item.targetSubject}</span>
              </article>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <p className="eyebrow">成就系统</p>
          <p>{dashboard.achievementSummary.nextMilestone}</p>
          <Link className="cta-button cta-button-secondary" to="/achievements">查看成就墙</Link>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <p className="eyebrow">学习画像</p>
          <div className="summary-grid">
            <article className="summary-card">
              <span className="node-step">累计完成</span>
              <h2>累计完成 {dashboard.learningVitals.totalCompletedLevels} 关</h2>
              <p>正在稳稳推进 {dashboard.learningVitals.strongestSubjectTitle} 的学习节奏。</p>
            </article>
            <article className="summary-card">
              <span className="node-step">平均准确率</span>
              <h2>平均准确率 {dashboard.learningVitals.averageAccuracyPercent}%</h2>
              <p>保持轻松练习，让会的内容更稳、不会的内容慢慢变熟。</p>
            </article>
            <article className="summary-card">
              <span className="node-step">学习节奏</span>
              <h2>平均单关用时 {dashboard.learningVitals.averageSessionMinutes} 分钟</h2>
              <p>最投入时段：{dashboard.learningVitals.bestLearningPeriodLabel}</p>
              <p>近 7 天有效学习 {dashboard.learningVitals.effectiveLearningDays} 天</p>
            </article>
          </div>
        </article>

        <article className="panel-card">
          <p className="eyebrow">学科拆解</p>
          <div className="badge-grid">
            {dashboard.subjectInsights.map((item) => (
              <article className="badge-card" key={item.subjectCode}>
                <h3>{item.subjectTitle}</h3>
                <p>已完成 {item.completedLevels} / {item.totalLevels} 关</p>
                <span>准确率 {item.accuracyPercent}% · 本周学习 {item.studyMinutes} 分钟</span>
                <p>{`下一关建议：${item.nextLevelTitle}`}</p>
                <p>{item.nextLevelReason}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <p className="eyebrow">最近完成</p>
          <div className="rank-list">
            {dashboard.recentActivities.map((item) => (
              <article className="rank-card" key={`${item.subjectTitle}-${item.levelTitle}-${item.completedAtLabel}`}>
                <strong>{item.levelTitle}</strong>
                <p>{item.subjectTitle}</p>
                <span>{item.completedAtLabel} · {item.earnedStars} 颗星星</span>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
