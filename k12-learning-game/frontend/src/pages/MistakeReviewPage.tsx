import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMistakeReviewCenter, submitMistakeReview, type MistakeReviewCenterData } from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { useSession } from '../session';

interface MistakeReviewPageProps {
  data?: MistakeReviewCenterData;
}

export function MistakeReviewPage({ data }: MistakeReviewPageProps) {
  const [reviewCenter, setReviewCenter] = useState<MistakeReviewCenterData | null>(data ?? null);
  const [submittingLevelCode, setSubmittingLevelCode] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState('');
  const [latestMasteryStatus, setLatestMasteryStatus] = useState('');
  const { session } = useSession();

  useEffect(() => {
    if (data) {
      return;
    }

    getMistakeReviewCenter().then(setReviewCenter);
  }, [data, session?.childProfileId]);

  const handleSubmitReview = async (levelCode: string) => {
    setSubmittingLevelCode(levelCode);
    setReviewMessage('');
    setLatestMasteryStatus('');

    try {
      const response = await submitMistakeReview(levelCode, {
        correctCount: 3,
        wrongCount: 0,
        durationSeconds: 120
      });
      setReviewCenter(response.reviewCenter);
      setLatestMasteryStatus(response.masteryStatus);
      setReviewMessage(response.nextAction);
    } catch {
      setReviewMessage('复习结果提交暂时迷路了，请稍后再试一次。');
    } finally {
      setSubmittingLevelCode(null);
    }
  };

  if (!reviewCenter) {
    return <main className="screen"><p>正在翻开错题本...</p></main>;
  }

  return (
    <main className="screen screen-engagement">
      <PageTopBar backLabel="返回首页" backTo="/" />

      <section className="map-header engagement-hero mistake-hero">
        <p className="eyebrow">复习小屋</p>
        <h1>错题本</h1>
        <p>{reviewCenter.childNickname}，把错过的地方变成下一次更稳的星星。</p>
        <div className="engagement-stat-row">
          <span>共 {reviewCenter.totalMistakes} 个错题点</span>
          <span>{reviewCenter.readyToMasterCount} 个知识点接近掌握</span>
        </div>
        {latestMasteryStatus ? <strong className="mastery-status-flare">{latestMasteryStatus}</strong> : null}
        {reviewMessage ? <p className="settlement-message" role="status">{reviewMessage}</p> : null}
      </section>

      <section className="mistake-pack-list">
        {reviewCenter.items.length > 0 ? reviewCenter.items.map((item) => (
          <article className="mistake-pack-card" key={item.levelCode}>
            <div>
              <span className="engagement-pill">{item.subjectTitle}</span>
              <h2>{item.levelTitle}</h2>
              <p>{item.knowledgePointTitle} · 错 {item.mistakeCount} 次</p>
              <strong>{item.masteryStatus}</strong>
              <p>{item.reviewPrompt}</p>
            </div>
            <ol className="review-step-list">
              {item.reviewSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="mistake-action-row">
              <Link className="cta-button" to={`/levels/${item.levelCode}`}>
                开始复习{item.levelTitle}
              </Link>
              <button
                className="cta-button cta-button-secondary review-submit-button"
                disabled={submittingLevelCode === item.levelCode}
                type="button"
                onClick={() => void handleSubmitReview(item.levelCode)}
              >
                {submittingLevelCode === item.levelCode ? '提交中...' : `我已复习，会做了${item.levelTitle}`}
              </button>
            </div>
          </article>
        )) : (
          <article className="panel-card">
            <p className="eyebrow">暂时没有错题</p>
            <h2>今天的小岛很平静</h2>
            <p>继续完成主线关卡，有需要复习的内容时这里会自动出现。</p>
          </article>
        )}
      </section>
    </main>
  );
}
