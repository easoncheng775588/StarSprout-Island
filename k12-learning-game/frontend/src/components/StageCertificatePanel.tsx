import type { AchievementStageFamilyData } from '../api';

interface StageCertificatePanelProps {
  childNickname: string;
  stageFamilies: AchievementStageFamilyData[];
}

function getCertificateStatus(family: AchievementStageFamilyData) {
  const remainingCount = Math.max(family.totalCount - family.unlockedCount, 0);

  if (family.totalCount > 0 && remainingCount === 0) {
    return {
      label: '已获得',
      description: '这段学习路线已经集齐阶段徽章，可以把证书展示给家人看。',
      remainingText: '证书已点亮'
    };
  }

  return {
    label: '进行中',
    description: '继续完成当前学段任务，集齐阶段徽章后证书会自动点亮。',
    remainingText: `再点亮 ${remainingCount} 枚阶段徽章`
  };
}

export function StageCertificatePanel({ childNickname, stageFamilies }: StageCertificatePanelProps) {
  if (stageFamilies.length === 0) {
    return null;
  }

  return (
    <section className="panel-card certificate-panel">
      <div className="panel-heading-row">
        <div>
          <p className="eyebrow">阶段证书</p>
          <h2>{childNickname}的成长证书夹</h2>
        </div>
        <button className="session-button session-button-secondary" type="button" onClick={() => window.print()}>
          打印证书
        </button>
      </div>
      <div className="certificate-grid">
        {stageFamilies.map((family) => {
          const status = getCertificateStatus(family);

          return (
            <article
              className={`certificate-card ${status.label === '已获得' ? 'certificate-card-earned' : ''}`}
              key={family.stageLabel}
            >
              <div className="certificate-ribbon">{status.label}</div>
              <p className="eyebrow">{family.stageLabel}</p>
              <h3>{family.stageLabel}成长证书</h3>
              <p>{status.description}</p>
              <strong>{status.remainingText}</strong>
              <div className="badge-progress-track" aria-label={`${family.stageLabel}成长证书进度`}>
                <span style={{ width: `${family.progressPercent}%` }} />
              </div>
              <p>证书进度 {family.unlockedCount} / {family.totalCount} 枚阶段徽章</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
