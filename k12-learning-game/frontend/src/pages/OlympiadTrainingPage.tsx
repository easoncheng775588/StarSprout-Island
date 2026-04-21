import { Link } from 'react-router-dom';
import { PageTopBar } from '../components/PageTopBar';
import { olympiadGrades } from '../data/olympiadData';

const totalTopicCount = olympiadGrades.reduce((sum, grade) => sum + grade.topics.length, 0);

export function OlympiadTrainingPage() {
  return (
    <main className="screen screen-olympiad">
      <PageTopBar backTo="/" backLabel="返回首页" />

      <section className="olympiad-hero" aria-labelledby="olympiad-title">
        <div className="olympiad-hero-copy">
          <p className="eyebrow">小学奥数 · 1-6 年级</p>
          <h1 id="olympiad-title">奥数训练营</h1>
          <p>
            把经典思维题拆成可观察、可选择、可反馈的小关卡。孩子不是直接背套路，
            而是先看见模型，再试着说出自己的推理。
          </p>
          <div className="olympiad-hero-actions">
            <Link className="cta-button" to="/levels/olympiad-g1-pattern-001">
              从一年级开始训练
            </Link>
            <a className="cta-button cta-button-secondary" href="#olympiad-grade-map">
              查看全部年级
            </a>
          </div>
        </div>
        <div className="olympiad-orbit" aria-label="奥数训练星图">
          <span className="olympiad-orbit-core">思维</span>
          <span className="olympiad-orbit-token olympiad-orbit-token-1">规律</span>
          <span className="olympiad-orbit-token olympiad-orbit-token-2">模型</span>
          <span className="olympiad-orbit-token olympiad-orbit-token-3">推理</span>
        </div>
      </section>

      <section className="olympiad-stats" aria-label="训练营概览">
        <div>
          <strong>{olympiadGrades.length}</strong>
          <span>个年级路线</span>
        </div>
        <div>
          <strong>{totalTopicCount}</strong>
          <span>个 MVP 主题关卡</span>
        </div>
        <div>
          <strong>3</strong>
          <span>步训练法：看模型、做选择、听反馈</span>
        </div>
      </section>

      <section className="olympiad-grade-map" id="olympiad-grade-map" aria-label="1到6年级奥数路线">
        {olympiadGrades.map((grade) => (
          <article className="olympiad-grade-card" key={grade.grade} style={{ ['--olympiad-accent' as string]: grade.color }}>
            <div className="olympiad-grade-card-header">
              <div>
                <p className="eyebrow">训练路线</p>
                <h2>{grade.grade}</h2>
              </div>
              <span className="olympiad-grade-badge">{grade.topics.length} 关</span>
            </div>
            <p>{grade.subtitle}</p>
            <div className="olympiad-topic-list">
              {grade.topics.map((topic) => (
                <Link className="olympiad-topic-card" key={topic.levelCode} to={`/levels/${topic.levelCode}`}>
                  <span className="olympiad-topic-icon" aria-hidden="true">{topic.icon}</span>
                  <span>
                    <strong>{topic.title}</strong>
                    <small>{topic.lesson}</small>
                    <em>{topic.skill}</em>
                  </span>
                  <b>挑战 {topic.title}</b>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
