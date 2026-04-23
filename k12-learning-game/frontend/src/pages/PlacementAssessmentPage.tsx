import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { updateChildProfile } from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { useSession } from '../session';

type PlacementStage = '幼小衔接' | '一年级' | '二年级';

interface PlacementQuestion {
  id: string;
  title: string;
  prompt: string;
  choices: Array<{
    label: string;
    score: number;
  }>;
}

const placementQuestions: PlacementQuestion[] = [
  {
    id: 'within-10',
    title: '数感起步',
    prompt: '2 + 3 等于几？',
    choices: [
      { label: '4', score: 0 },
      { label: '5', score: 1 },
      { label: '6', score: 0 }
    ]
  },
  {
    id: 'teen-number',
    title: '认识十几',
    prompt: '10 和 4 合起来是多少？',
    choices: [
      { label: '13', score: 0 },
      { label: '14', score: 1 },
      { label: '16', score: 0 }
    ]
  },
  {
    id: 'first-grade-addition',
    title: '一年级计算',
    prompt: '7 + 5 可以先凑十，答案是几？',
    choices: [
      { label: '11', score: 0 },
      { label: '12', score: 2 },
      { label: '13', score: 0 }
    ]
  },
  {
    id: 'shape-language',
    title: '图形观察',
    prompt: '四条边、对边一样长的图形更像哪一个？',
    choices: [
      { label: '圆形', score: 0 },
      { label: '长方形', score: 2 },
      { label: '三角形', score: 0 }
    ]
  },
  {
    id: 'second-grade-array',
    title: '二年级结构',
    prompt: '2 行苹果，每行 4 个，一共有几个？',
    choices: [
      { label: '6', score: 0 },
      { label: '8', score: 2 },
      { label: '10', score: 0 }
    ]
  }
];

function getRecommendedStage(score: number): PlacementStage {
  if (score >= 7) {
    return '二年级';
  }

  if (score >= 5) {
    return '一年级';
  }

  return '幼小衔接';
}

function getStageReason(stage: PlacementStage) {
  if (stage === '二年级') {
    return '孩子已经能理解 20 以内计算和简单数组结构，可以从二年级的结构化数学继续挑战。';
  }

  if (stage === '一年级') {
    return '孩子已经具备基本数感，可以从一年级的 20 以内计算、时间、图形和生活应用开始。';
  }

  return '建议先从幼小衔接开始，把数数、10 以内加减、图形方位和表达信心打牢。';
}

export function PlacementAssessmentPage() {
  const { session, login } = useSession();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isApplying, setIsApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [applyError, setApplyError] = useState('');

  const activeChild = session?.children.find((child) => child.id === session.childProfileId) ?? null;
  const score = useMemo(() => placementQuestions.reduce((sum, question) => {
    const selectedLabel = answers[question.id];
    const selectedChoice = question.choices.find((choice) => choice.label === selectedLabel);
    return sum + (selectedChoice?.score ?? 0);
  }, 0), [answers]);
  const completedCount = Object.keys(answers).length;
  const isComplete = completedCount === placementQuestions.length;
  const recommendedStage = getRecommendedStage(score);

  async function handleApplyStage() {
    if (!session || !activeChild || !isComplete) {
      return;
    }

    setIsApplying(true);
    setApplyMessage('');
    setApplyError('');

    try {
      const updatedChild = await updateChildProfile(session.parentAccountId, activeChild.id, {
        nickname: activeChild.nickname,
        title: activeChild.title,
        stageLabel: recommendedStage,
        avatarColor: activeChild.avatarColor ?? '#ffcf70'
      });
      const nextChildren = session.children.map((child) => (child.id === updatedChild.id ? updatedChild : child));

      login({
        parentAccountId: session.parentAccountId,
        parentDisplayName: session.parentDisplayName,
        childProfileId: updatedChild.id,
        childNickname: updatedChild.nickname,
        children: nextChildren
      });
      setApplyMessage(`已经把学习路线调整为${recommendedStage}`);
    } catch {
      setApplyError('学习路线暂时没有调整成功，请稍后再试。');
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <main className="screen screen-placement">
      <PageTopBar backLabel="返回首页" backTo="/" />

      <section className="map-header placement-hero">
        <p className="eyebrow">入学能力诊断</p>
        <h1>数学能力小测评</h1>
        <p>用 5 道轻量题先看孩子的数学准备度，再推荐更合适的学习起点。</p>
        <div className="engagement-stat-row">
          <span>已完成 {completedCount} / {placementQuestions.length} 题</span>
          <span>当前小朋友：{session?.childNickname ?? '小学习者'}</span>
          <span>当前路线：{activeChild?.stageLabel ?? '幼小衔接'}</span>
        </div>
      </section>

      <section className="placement-layout">
        <div className="placement-question-list">
          {placementQuestions.map((question, questionIndex) => (
            <article className="panel-card placement-question-card" key={question.id}>
              <span className="node-step">第 {questionIndex + 1} 题 · {question.title}</span>
              <h2>{question.prompt}</h2>
              <div className="placement-choice-row">
                {question.choices.map((choice) => (
                  <button
                    className={answers[question.id] === choice.label ? 'choice-button choice-button-selected' : 'choice-button'}
                    key={choice.label}
                    type="button"
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: choice.label }))}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className="panel-card placement-result-card">
          <p className="eyebrow">测评结果</p>
          {isComplete ? (
            <>
              <h2>推荐从{recommendedStage}开始</h2>
              <p>{getStageReason(recommendedStage)}</p>
              <div className="placement-score-meter" aria-label={`测评分 ${score}`}>
                <strong>{score}</strong>
                <span>准备度星光</span>
              </div>
              <button className="cta-button" disabled={isApplying} type="button" onClick={handleApplyStage}>
                {isApplying ? '正在应用...' : `应用到${session?.childNickname ?? '孩子'}的学习路线`}
              </button>
              <Link className="cta-button cta-button-secondary" to="/subjects/math">
                先去数学岛看看
              </Link>
              {applyMessage ? <p className="success-feedback">{applyMessage}</p> : null}
              {applyError ? <p className="error-feedback">{applyError}</p> : null}
            </>
          ) : (
            <>
              <h2>先完成 5 道小题</h2>
              <p>题目会从数数、十几认识、20 以内加法、图形观察到数组结构逐步递进。</p>
              <div className="progress-bar">
                <span style={{ width: `${(completedCount / placementQuestions.length) * 100}%` }} />
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
