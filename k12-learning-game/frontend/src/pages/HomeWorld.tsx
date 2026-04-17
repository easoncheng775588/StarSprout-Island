import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeOverview } from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { useSession } from '../session';
import type { HomeOverview } from '../types';

export function HomeWorld() {
  const [homeOverview, setHomeOverview] = useState<HomeOverview | null>(null);
  const { session } = useSession();

  useEffect(() => {
    getHomeOverview().then(setHomeOverview);
  }, [session]);

  if (!homeOverview) {
    return <main className="screen"><p>正在唤醒今天的学习小岛...</p></main>;
  }

  return (
    <main className="screen screen-home">
      <PageTopBar />

      <section className="hero-card">
        <div>
          <p className="eyebrow">{homeOverview.featuredWorld}</p>
          <h1>{homeOverview.child.nickname}，准备再次出发吧</h1>
          <p className="hero-copy">{homeOverview.todayTask}</p>
        </div>
        <div className="hero-stats">
          <div>
            <span className="stat-label">连续学习</span>
            <strong>{homeOverview.child.streakDays} 天</strong>
          </div>
          <div>
            <span className="stat-label">累计星星</span>
            <strong>{homeOverview.child.stars} 颗</strong>
          </div>
        </div>
      </section>

      <section className="task-panel" aria-label="今日任务">
        <div>
          <p className="eyebrow">今日任务</p>
          <h2>点亮今天的学习星轨</h2>
          <p>{homeOverview.child.title}</p>
        </div>
        <Link className="cta-button" to={homeOverview.nextLevelCode ? `/levels/${homeOverview.nextLevelCode}` : '/levels/math-numbers-001'}>
          {homeOverview.nextLevelTitle ? `继续挑战 ${homeOverview.nextLevelTitle}` : '开始任务'}
        </Link>
      </section>

      <section className="family-panel" aria-label="家长与激励入口">
        <div className="family-panel-copy">
          <p className="eyebrow">家长陪伴</p>
          <h2>看看成长记录，也给今天一点鼓励</h2>
          <p>家长可以快速查看学习小结和排行榜变化，陪孩子一起感受进步。</p>
          <p className="achievement-preview-text">
            已点亮 {homeOverview.achievementPreview.unlockedCount} / {homeOverview.achievementPreview.totalCount} 枚徽章，
            再点亮 1 枚徽章，就能获得“{homeOverview.achievementPreview.nextBadgeName}”
          </p>
        </div>
        <div className="family-panel-actions">
          <Link className="cta-button cta-button-secondary" to="/parent">家长中心</Link>
          <Link className="cta-button cta-button-secondary" to="/leaderboard">排行榜</Link>
          <Link className="cta-button cta-button-secondary" to="/achievements">成就墙</Link>
        </div>
      </section>

      <section className="island-grid">
        {homeOverview.subjects.map((subject) => (
          <Link
            className="island-card"
            key={subject.code}
            to={`/subjects/${subject.code}`}
            style={{ ['--island-accent' as string]: subject.color }}
          >
            <span className="eyebrow">学科岛屿</span>
            <h3>{subject.title}</h3>
            <p>{subject.subtitle}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
