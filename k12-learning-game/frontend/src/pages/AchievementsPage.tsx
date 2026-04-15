import { useEffect, useState } from 'react';
import { getAchievements, type AchievementsData } from '../api';
import { PageBackLink } from '../components/PageBackLink';

interface AchievementsPageProps {
  data?: AchievementsData;
}

export function AchievementsPage({ data }: AchievementsPageProps) {
  const [achievements, setAchievements] = useState<AchievementsData | null>(data ?? null);

  useEffect(() => {
    if (data) {
      return;
    }

    getAchievements().then(setAchievements);
  }, [data]);

  if (!achievements) {
    return <main className="screen"><p>正在点亮孩子的成就墙...</p></main>;
  }

  return (
    <main className="screen screen-achievements">
      <PageBackLink label="返回首页" to="/" />

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
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <p className="eyebrow">已解锁</p>
          <div className="badge-grid">
            {achievements.unlockedBadges.map((badge) => (
              <article className="badge-card badge-card-unlocked" key={badge.code}>
                <h3>{badge.title}</h3>
                <p>{badge.description}</p>
                <span>{badge.progressText}</span>
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
                <p>{badge.description}</p>
                <span>{badge.progressText}</span>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
