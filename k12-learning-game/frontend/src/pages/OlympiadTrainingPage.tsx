import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTopBar } from '../components/PageTopBar';
import { olympiadGrades, olympiadMethodSteps } from '../data/olympiadData';

const totalTopicCount = olympiadGrades.reduce((sum, grade) => sum + grade.topics.length, 0);
const allTopics = olympiadGrades.flatMap((grade) => grade.topics.map((topic) => ({ ...topic, grade: grade.grade })));
const abilityOrder = ['观察规律', '计算策略', '图形空间', '模型应用', '逻辑推理'];

function getGradeNumber(grade: string) {
  return olympiadGrades.findIndex((item) => item.grade === grade) + 1;
}

export function OlympiadTrainingPage() {
  const [selectedGrade, setSelectedGrade] = useState('全部');
  const visibleGrades = selectedGrade === '全部'
    ? olympiadGrades
    : olympiadGrades.filter((grade) => grade.grade === selectedGrade);
  const visibleTopics = visibleGrades.flatMap((grade) => grade.topics.map((topic) => ({ ...topic, grade: grade.grade })));
  const recommendedTopic = visibleTopics[0] ?? allTopics[0];
  const abilityStats = abilityOrder.map((ability) => ({
    ability,
    count: allTopics.filter((topic) => topic.ability === ability).length
  }));

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
          <strong>4</strong>
          <span>步训练法：模型讲解、例题探索、变式挑战、思维总结</span>
        </div>
      </section>

      <section className="olympiad-command-panel" aria-label="奥数训练功能面板">
        <article className="olympiad-recommend-card">
          <p className="eyebrow">今日推荐训练</p>
          <h2>{recommendedTopic.grade} · {recommendedTopic.title}</h2>
          <p>{recommendedTopic.recommendation}</p>
          <div className="olympiad-recommend-meta">
            <span>{recommendedTopic.ability}</span>
            <span>{recommendedTopic.difficulty}</span>
            <span>{recommendedTopic.lesson}</span>
          </div>
          <Link className="cta-button" to={`/levels/${recommendedTopic.levelCode}`}>
            开始推荐关卡
          </Link>
        </article>

        <article className="olympiad-ability-card">
          <p className="eyebrow">能力雷达</p>
          <h2>五类思维能力都要慢慢点亮</h2>
          <div className="olympiad-ability-list">
            {abilityStats.map((item) => (
              <div className="olympiad-ability-row" key={item.ability}>
                <span>{item.ability}</span>
                <div className="olympiad-ability-track" aria-label={`${item.ability} ${item.count} 关`}>
                  <i style={{ width: `${Math.max(18, item.count * 18)}%` }} />
                </div>
                <b>{item.count} 关</b>
              </div>
            ))}
          </div>
        </article>

        <article className="olympiad-method-card">
          <p className="eyebrow">解题四步法</p>
          <h2>把“我不会”变成“我先试一步”</h2>
          <div className="olympiad-method-list">
            {olympiadMethodSteps.map((step) => (
              <div className="olympiad-method-step" key={step.title}>
                <span aria-hidden="true">{step.icon}</span>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="olympiad-filter-panel" aria-label="奥数年级筛选">
        <p className="eyebrow">选择训练路线</p>
        <div className="olympiad-grade-tabs" role="list" aria-label="年级路线筛选">
          <button
            className={selectedGrade === '全部' ? 'olympiad-grade-tab olympiad-grade-tab-active' : 'olympiad-grade-tab'}
            onClick={() => setSelectedGrade('全部')}
            type="button"
          >
            全部路线
          </button>
          {olympiadGrades.map((grade) => (
            <button
              className={selectedGrade === grade.grade ? 'olympiad-grade-tab olympiad-grade-tab-active' : 'olympiad-grade-tab'}
              key={grade.grade}
              onClick={() => setSelectedGrade(grade.grade)}
              type="button"
            >
              {grade.grade}路线
            </button>
          ))}
        </div>
      </section>

      <section className="olympiad-grade-map" id="olympiad-grade-map" aria-label="1到6年级奥数路线">
        {visibleGrades.map((grade) => (
          <article className="olympiad-grade-card" key={grade.grade} style={{ ['--olympiad-accent' as string]: grade.color }}>
            <div className="olympiad-grade-card-header">
              <div>
                <p className="eyebrow">训练路线</p>
                <h2>{grade.grade}</h2>
              </div>
              <span className="olympiad-grade-badge">G{getGradeNumber(grade.grade)} · {grade.topics.length} 关</span>
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
                  <span className="olympiad-topic-tags">
                    <i>{topic.ability}</i>
                    <i>{topic.difficulty}</i>
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
