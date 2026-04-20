import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLearningPath, type LearningPathData } from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { useSession } from '../session';

interface LearningPathPageProps {
  data?: LearningPathData;
}

function statusLabel(status: string) {
  if (status === 'completed') {
    return '已完成';
  }
  if (status === 'recommended') {
    return '推荐下一站';
  }
  if (status === 'locked') {
    return '待解锁';
  }
  return '可挑战';
}

export function LearningPathPage({ data }: LearningPathPageProps) {
  const [learningPath, setLearningPath] = useState<LearningPathData | null>(data ?? null);
  const { session } = useSession();

  useEffect(() => {
    if (data) {
      return;
    }

    getLearningPath().then(setLearningPath);
  }, [data, session?.childProfileId]);

  if (!learningPath) {
    return <main className="screen"><p>正在铺开学习路径...</p></main>;
  }

  return (
    <main className="screen screen-engagement">
      <PageTopBar backLabel="返回首页" backTo="/" />

      <section className="map-header engagement-hero path-hero">
        <p className="eyebrow">学习路径</p>
        <h1>{learningPath.stageLabel}学习路径</h1>
        <p>先完成前一站，再解锁下一站，让孩子看到清楚、安全、有期待的前进路线。</p>
        <div className="engagement-stat-row">
          <span>已完成 {learningPath.completedLevels} / {learningPath.totalLevels} 关</span>
          <span>主线地图按当前学段自动规划</span>
        </div>
      </section>

      <section className="learning-path-board">
        {learningPath.chapters.map((chapter) => (
          <article className="learning-path-chapter" key={`${chapter.subjectCode}-${chapter.chapterTitle}`}>
            <div className="chapter-header">
              <span className="engagement-pill">{chapter.subjectTitle}</span>
              <h2>{chapter.chapterTitle}</h2>
              <p>{chapter.chapterSubtitle}</p>
            </div>

            <div className="learning-path-levels">
              {chapter.levels.map((level, index) => (
                <div className={`learning-path-node learning-path-node-${level.status}`} key={level.levelCode}>
                  <span className="node-step">第 {index + 1} 站</span>
                  <strong>{level.levelTitle}</strong>
                  <p>{statusLabel(level.status)}</p>
                  {level.locked ? (
                    <span className="lock-reason">{level.lockReason}</span>
                  ) : (
                    <Link className="cta-button cta-button-secondary" to={`/levels/${level.levelCode}`}>
                      挑战{level.levelTitle}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
