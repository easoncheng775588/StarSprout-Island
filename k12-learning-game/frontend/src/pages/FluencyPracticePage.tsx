import { useState } from 'react';
import { Link } from 'react-router-dom';
import { recordFluencyAttempt } from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { useSession } from '../session';

interface FluencyQuestion {
  prompt: string;
  choices: number[];
  answer: number;
}

interface FluencyPracticeSet {
  focusArea: string;
  focusAreaLabel: string;
  questions: FluencyQuestion[];
}

const fluencyQuestionSets: Record<string, FluencyPracticeSet> = {
  幼小衔接: {
    focusArea: 'number-sense',
    focusAreaLabel: '数感启蒙',
    questions: [
      { prompt: '2 + 3 = ?', choices: [4, 5, 6], answer: 5 },
      { prompt: '6 - 1 = ?', choices: [4, 5, 7], answer: 5 },
      { prompt: '4 + 4 = ?', choices: [7, 8, 9], answer: 8 },
      { prompt: '10 - 3 = ?', choices: [6, 7, 8], answer: 7 },
      { prompt: '5 + 2 = ?', choices: [6, 7, 9], answer: 7 }
    ]
  },
  一年级: {
    focusArea: 'addition-within-20',
    focusAreaLabel: '20 以内加减',
    questions: [
      { prompt: '3 + 4 = ?', choices: [6, 7, 8], answer: 7 },
      { prompt: '9 - 2 = ?', choices: [6, 7, 8], answer: 7 },
      { prompt: '8 + 4 = ?', choices: [11, 12, 13], answer: 12 },
      { prompt: '15 - 7 = ?', choices: [6, 8, 9], answer: 8 },
      { prompt: '6 + 9 = ?', choices: [14, 15, 16], answer: 15 }
    ]
  },
  二年级: {
    focusArea: 'multiplication-division',
    focusAreaLabel: '乘除数感',
    questions: [
      { prompt: '3 × 4 = ?', choices: [10, 12, 14], answer: 12 },
      { prompt: '18 ÷ 3 = ?', choices: [5, 6, 7], answer: 6 },
      { prompt: '25 + 17 = ?', choices: [40, 42, 44], answer: 42 },
      { prompt: '36 - 19 = ?', choices: [16, 17, 18], answer: 17 },
      { prompt: '5 × 6 = ?', choices: [28, 30, 32], answer: 30 }
    ]
  },
  三年级: {
    focusArea: 'multi-step-arithmetic',
    focusAreaLabel: '多步运算',
    questions: [
      { prompt: '48 ÷ 6 = ?', choices: [7, 8, 9], answer: 8 },
      { prompt: '125 + 75 = ?', choices: [180, 200, 220], answer: 200 },
      { prompt: '9 × 7 = ?', choices: [56, 63, 72], answer: 63 },
      { prompt: '84 - 29 = ?', choices: [55, 56, 57], answer: 55 },
      { prompt: '6 × 8 = ?', choices: [46, 48, 54], answer: 48 }
    ]
  },
  四年级: {
    focusArea: 'decimal-number-sense',
    focusAreaLabel: '小数数感',
    questions: [
      { prompt: '0.4 + 0.3 = ?', choices: [0.6, 0.7, 0.8], answer: 0.7 },
      { prompt: '25 × 4 = ?', choices: [80, 100, 120], answer: 100 },
      { prompt: '120 ÷ 5 = ?', choices: [20, 24, 26], answer: 24 },
      { prompt: '3.5 - 1.2 = ?', choices: [2.1, 2.3, 2.5], answer: 2.3 },
      { prompt: '16 × 6 = ?', choices: [86, 96, 106], answer: 96 }
    ]
  }
};

function getFluencyPracticeSet(stageLabel: string) {
  return fluencyQuestionSets[stageLabel] ?? fluencyQuestionSets.幼小衔接;
}

export function FluencyPracticePage() {
  const { session } = useSession();
  const activeChild = session?.children.find((child) => child.id === session.childProfileId);
  const childNickname = activeChild?.nickname ?? session?.childNickname ?? '小朋友';
  const stageLabel = activeChild?.stageLabel ?? '幼小衔接';
  const practiceSet = getFluencyPracticeSet(stageLabel);
  const questions = practiceSet.questions;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [lastFeedback, setLastFeedback] = useState('先看题，再选答案，保持稳稳的节奏。');
  const [recordFeedback, setRecordFeedback] = useState<string | null>(null);
  const isFinished = answeredCount >= questions.length;
  const currentQuestion = questions[Math.min(questionIndex, questions.length - 1)];

  function handleAnswer(choice: number) {
    if (isFinished) {
      return;
    }

    const isCorrect = choice === currentQuestion.answer;
    const nextAnsweredCount = answeredCount + 1;
    const nextCorrectCount = correctCount + (isCorrect ? 1 : 0);
    setAnsweredCount(nextAnsweredCount);
    setCorrectCount(nextCorrectCount);
    setLastFeedback(isCorrect ? '答对了，数感节奏很稳' : `差一点，正确答案是 ${currentQuestion.answer}`);

    if (nextAnsweredCount < questions.length) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    void recordFluencyAttempt({
      stageLabel,
      focusArea: practiceSet.focusArea,
      totalQuestions: questions.length,
      correctCount: nextCorrectCount,
      durationSeconds: 60
    })
      .then((result) => setRecordFeedback(result.encouragement))
      .catch(() => setRecordFeedback('快练结果暂时没有同步成功，稍后再试也可以。'));
  }

  return (
    <main className="screen screen-fluency">
      <PageTopBar backLabel="返回首页" backTo="/" />

      <section className="fluency-hero">
        <div>
          <p className="eyebrow">每日快练</p>
          <h1>1 分钟数感快练</h1>
          <p>用短短一组题保持计算手感，重点是又快又稳，不追求压力竞速。</p>
        </div>
        <div className="fluency-timer-card" aria-label="快练计时器">
          <span>60</span>
          <strong>秒快练</strong>
        </div>
      </section>

      <section className="fluency-practice-card">
        <div className="fluency-progress-row">
          <span className="node-step">{stageLabel}快练</span>
          <p>{practiceSet.focusAreaLabel}</p>
          <strong>{answeredCount} / {questions.length} 题</strong>
        </div>

        {isFinished ? (
          <div className="fluency-result-card">
            <p className="eyebrow">今日快练完成</p>
            <h2>完成 {questions.length} 题，答对 {correctCount} 题</h2>
            <p>{childNickname}的数感速度正在变稳</p>
            {recordFeedback ? <p>{recordFeedback}</p> : <p>正在同步今日快练记录...</p>}
            <Link className="cta-button" to="/daily-tasks">去看今日任务</Link>
          </div>
        ) : (
          <div className="fluency-question-card">
            <p className="eyebrow">第 {questionIndex + 1} 题</p>
            <h2>{currentQuestion.prompt}</h2>
            <div className="fluency-choice-row">
              {currentQuestion.choices.map((choice) => (
                <button
                  className="choice-button fluency-choice-button"
                  key={`${currentQuestion.prompt}-${choice}`}
                  onClick={() => handleAnswer(choice)}
                  type="button"
                >
                  {choice}
                </button>
              ))}
            </div>
            <p className="step-feedback">{lastFeedback}</p>
          </div>
        )}
      </section>
    </main>
  );
}
