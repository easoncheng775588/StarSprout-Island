import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSubjectMap } from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { useSession } from '../session';
import type { SubjectCode } from '../types';
import type { SubjectMapData } from '../types';

export function SubjectMap() {
  const params = useParams<{ subjectCode: SubjectCode }>();
  const [subject, setSubject] = useState<SubjectMapData | null>(null);
  const { session } = useSession();
  const activeChildStageLabel = session?.children.find((child) => child.id === session.childProfileId)?.stageLabel ?? '幼小衔接';

  useEffect(() => {
    if (!params.subjectCode) {
      return;
    }

    setSubject(null);
    getSubjectMap(params.subjectCode).then(setSubject);
  }, [params.subjectCode, session?.childProfileId, activeChildStageLabel]);

  if (!params.subjectCode) {
    return <main className="screen"><p>暂时找不到这座学科岛。</p></main>;
  }

  if (!subject) {
    return <main className="screen"><p>正在铺开这座学科岛的闯关地图...</p></main>;
  }

  return (
    <main className="screen screen-map">
      <PageTopBar backLabel="返回首页" backTo="/" />

      <section className="map-header">
        <p className="eyebrow">{subject.subjectCode.toUpperCase()}</p>
        <h1>{subject.subjectTitle}</h1>
        <p>沿着不同学习主题继续探险，挑一站最想玩的内容出发吧。</p>
      </section>

      <div className="subject-chapter-list">
        {subject.chapters.map((chapter) => (
          <section className="path-card chapter-card" key={chapter.code}>
            <div className="chapter-header">
              <p className="eyebrow">主题区域</p>
              <h2>{chapter.title}</h2>
              <p>{chapter.subtitle}</p>
            </div>

            {chapter.levels.map((level, index) => (
              level.status === 'locked' ? (
                <div className="path-node path-node-locked" key={level.code}>
                  <span className="node-step">第 {index + 1} 站</span>
                  <strong>{level.title}</strong>
                  <p>先完成前一站，再解锁这里</p>
                </div>
              ) : (
                <Link className={`path-node path-node-${level.status}`} key={level.code} to={`/levels/${level.code}`}>
                  <span className="node-step">第 {index + 1} 站</span>
                  <strong>{level.title}</strong>
                </Link>
              )
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
