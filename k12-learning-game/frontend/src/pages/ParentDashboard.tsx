import { useEffect, useState } from 'react';
import { getParentDashboard, type ParentDashboardData } from '../api';
import { PageBackLink } from '../components/PageBackLink';

interface ParentDashboardProps {
  data?: ParentDashboardData;
}

export function ParentDashboard({ data }: ParentDashboardProps) {
  const [dashboard, setDashboard] = useState<ParentDashboardData | null>(data ?? null);

  useEffect(() => {
    if (data) {
      return;
    }

    getParentDashboard().then(setDashboard);
  }, [data]);

  if (!dashboard) {
    return <main className="screen"><p>正在整理孩子今天的学习报告...</p></main>;
  }

  return (
    <main className="screen screen-parent">
      <PageBackLink label="返回首页" to="/" />

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
                <span style={{ height: `${Math.max(point.minutes * 3, 24)}px` }} />
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
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
