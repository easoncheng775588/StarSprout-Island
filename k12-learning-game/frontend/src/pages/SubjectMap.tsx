import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSubjectMap } from '../api';
import { PageBackLink } from '../components/PageBackLink';
import type { SubjectCode } from '../types';
import type { SubjectMapData } from '../types';

export function SubjectMap() {
  const params = useParams<{ subjectCode: SubjectCode }>();
  const [subject, setSubject] = useState<SubjectMapData | null>(null);

  useEffect(() => {
    if (!params.subjectCode) {
      return;
    }

    getSubjectMap(params.subjectCode).then(setSubject);
  }, [params.subjectCode]);

  if (!params.subjectCode) {
    return <main className="screen"><p>暂时找不到这座学科岛。</p></main>;
  }

  if (!subject) {
    return <main className="screen"><p>正在铺开这座学科岛的闯关地图...</p></main>;
  }

  return (
    <main className="screen screen-map">
      <PageBackLink label="返回首页" to="/" />

      <section className="map-header">
        <p className="eyebrow">{subject.subjectCode.toUpperCase()}</p>
        <h1>{subject.chapterTitle}</h1>
        <p>{subject.chapterSubtitle}</p>
      </section>

      <section className="path-card">
        {subject.levels.map((level, index) => (
          <Link className={`path-node path-node-${level.status}`} key={level.code} to={`/levels/${level.code}`}>
            <span className="node-step">第 {index + 1} 站</span>
            <strong>{level.title}</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
