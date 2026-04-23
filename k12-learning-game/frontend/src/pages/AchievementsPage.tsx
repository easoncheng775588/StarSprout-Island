import { useEffect, useState } from 'react';
import { getAchievements, type AchievementsData } from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { useSession } from '../session';

interface AchievementsPageProps {
  data?: AchievementsData;
}

export function AchievementsPage({ data }: AchievementsPageProps) {
  const [achievements, setAchievements] = useState<AchievementsData | null>(data ?? null);
  const { session } = useSession();

  useEffect(() => {
    if (data) {
      return;
    }

    getAchievements().then(setAchievements);
  }, [data, session?.childProfileId]);

  if (!achievements) {
    return <main className="screen"><p>正在点亮孩子的成就墙...</p></main>;
  }

  return (
    <main className="screen screen-achievements">
      <PageTopBar backLabel="返回首页" backTo="/" />

      <section className="map-header">
        <p className="eyebrow">成就系统</p>
        <h1>{achievements.childNickname}的成就墙</h1>
        <p>把努力看得见，让每一次练习都能留下小小的光点。</p>
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <span className="node-step">已点亮徽章</span>
          <h2>已点亮 {achievements.unlockedCount} / {achievements.totalCount} 枚徽章</h2>
          <p>继续完成关卡、保持节奏，就会有更多奖励亮起来。</p>
        </article>
        <article className="summary-card">
          <span className="node-step">当前学段</span>
          <h2>当前学段成就：{achievements.currentStageLabel}</h2>
          <p>每个学段都有自己的启航、三岛探索、主线推进和稳稳通关目标。</p>
        </article>
      </section>

      <section className="panel-card stage-achievement-panel">
        <p className="eyebrow">学段成就家族</p>
        <div className="stage-family-grid">
          {achievements.stageFamilies.map((family) => (
            <article
              className={`stage-family-card ${family.stageLabel === achievements.currentStageLabel ? 'stage-family-card-current' : ''}`}
              key={family.stageLabel}
            >
              <div className="stage-family-header">
                <div>
                  <span className="node-step">{family.stageLabel}</span>
                  <h2>{family.title}</h2>
                </div>
                <strong>{family.unlockedCount} / {family.totalCount} 枚阶段徽章</strong>
              </div>
              <p>{family.description}</p>
              <div className="badge-progress-track" aria-label={`${family.title}进度`}>
                <span style={{ width: `${family.progressPercent}%` }} />
              </div>
              <div className="stage-badge-list">
                {family.badges.map((badge) => (
                  <span className={badge.unlocked ? 'stage-badge-chip stage-badge-chip-unlocked' : 'stage-badge-chip'} key={badge.code}>
                    {badge.title}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-card model-achievement-panel">
        <div className="panel-heading-row">
          <div>
            <p className="eyebrow">思维模型徽章</p>
            <h2>把看不见的数学思路点亮</h2>
          </div>
          <p>数轴、线段图、面积模型和分数条会随着模型关卡进度逐步点亮。</p>
        </div>
        <div className="badge-grid">
          {(achievements.modelBadges ?? []).length > 0 ? achievements.modelBadges.map((badge) => (
            <article className={badge.unlocked ? 'badge-card badge-card-unlocked' : 'badge-card'} key={badge.code}>
              <h3>{badge.title}</h3>
              <p>{badge.category} · {badge.rarityLabel}</p>
              <p>{badge.description}</p>
              <span>{badge.progressText}</span>
              <div className="badge-progress-track" aria-label={`${badge.title}进度`}>
                <span style={{ width: `${badge.progressPercent}%` }} />
              </div>
              <p>{badge.encouragement}</p>
            </article>
          )) : (
            <p>当前学段还没有模型徽章，完成数形结合关卡后会自动出现。</p>
          )}
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <p className="eyebrow">已解锁</p>
          <div className="badge-grid">
            {achievements.unlockedBadges.map((badge) => (
              <article className="badge-card badge-card-unlocked" key={badge.code}>
                <h3>{badge.title}</h3>
                <p>{badge.category} · {badge.rarityLabel}</p>
                <p>{badge.description}</p>
                <span>{badge.progressText}</span>
                <p>{badge.encouragement}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <p className="eyebrow">进行中</p>
          <div className="badge-grid">
            {achievements.inProgressBadges.map((badge) => (
              <article className="badge-card" key={badge.code}>
                <h3>{badge.title}</h3>
                <p>{badge.category} · {badge.rarityLabel}</p>
                <p>{badge.description}</p>
                <span>{badge.progressText}</span>
                <div className="badge-progress-track" aria-label={`${badge.title}进度`}>
                  <span style={{ width: `${badge.progressPercent}%` }} />
                </div>
                <p>{badge.encouragement}</p>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
