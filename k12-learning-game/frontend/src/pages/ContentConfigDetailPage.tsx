import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getContentConfigDetail,
  updateContentConfig,
  type ContentConfigDetailData
} from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { useSession } from '../session';

export function ContentConfigDetailPage() {
  const { levelCode = '' } = useParams();
  const { session } = useSession();
  const [detail, setDetail] = useState<ContentConfigDetailData | null>(null);
  const [knowledgePointCode, setKnowledgePointCode] = useState('');
  const [knowledgePointTitle, setKnowledgePointTitle] = useState('');
  const [variantCount, setVariantCount] = useState('0');
  const [activityConfigJson, setActivityConfigJson] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!levelCode) {
      return;
    }

    let cancelled = false;
    setErrorMessage('');
    setSaveMessage('');

    getContentConfigDetail(levelCode)
      .then((nextDetail) => {
        if (cancelled) {
          return;
        }

        setDetail(nextDetail);
        setKnowledgePointCode(nextDetail.knowledgePointCode);
        setKnowledgePointTitle(nextDetail.knowledgePointTitle);
        setVariantCount(String(nextDetail.variantCount));
        setActivityConfigJson(nextDetail.activityConfigJson);
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage('配置详情暂时没有读取成功，请稍后再试。');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [levelCode, session?.childProfileId]);

  async function handleSave() {
    if (!levelCode) {
      return;
    }

    setIsSaving(true);
    setSaveMessage('');
    setErrorMessage('');

    try {
      const updatedDetail = await updateContentConfig(levelCode, {
        knowledgePointCode: knowledgePointCode.trim(),
        knowledgePointTitle: knowledgePointTitle.trim(),
        variantCount: Math.max(1, Number.parseInt(variantCount, 10) || 0),
        activityConfigJson: activityConfigJson.trim()
      });
      setDetail(updatedDetail);
      setKnowledgePointCode(updatedDetail.knowledgePointCode);
      setKnowledgePointTitle(updatedDetail.knowledgePointTitle);
      setVariantCount(String(updatedDetail.variantCount));
      setActivityConfigJson(updatedDetail.activityConfigJson);
      setSaveMessage('配置已保存，健康检查已刷新。');
    } catch {
      setErrorMessage('这次没有保存成功，请检查 JSON 后再试一次。');
    } finally {
      setIsSaving(false);
    }
  }

  if (!detail && !errorMessage) {
    return <main className="screen"><p>正在读取配置详情...</p></main>;
  }

  if (!detail) {
    return (
      <main className="screen screen-parent screen-engagement">
        <PageTopBar backLabel="返回题库中心" backTo="/content-configs" />
        <section className="panel-card config-detail-shell">
          <h1>配置详情暂时不可用</h1>
          <p className="error-feedback">{errorMessage}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="screen screen-parent screen-engagement">
      <PageTopBar backLabel="返回题库中心" backTo="/content-configs" />

      <section className="map-header engagement-hero config-hero">
        <p className="eyebrow">内容运营</p>
        <h1>{detail.levelTitle} 配置详情</h1>
        <p>{detail.subjectTitle} · 步骤 {detail.stepCode} · {detail.stepPrompt}</p>
        <div className="engagement-stat-row">
          <span>素材主题：{detail.assetTheme}</span>
          <span>音频质量：{detail.audioQuality}</span>
          <span>配置来源：{detail.configSource}</span>
        </div>
      </section>

      <section className="config-detail-layout">
        <article className="panel-card config-detail-card">
          <div className="config-card-topline">
            <span className="engagement-pill">{detail.subjectTitle}</span>
            <span className={`config-health-pill config-health-pill-${detail.healthStatus}`}>
              状态：{detail.healthStatus === 'healthy' ? '健康' : '需补齐'}
            </span>
          </div>

          <div className="config-form-grid">
            <label className="config-field">
              <span>知识点编码</span>
              <input value={knowledgePointCode} onChange={(event) => setKnowledgePointCode(event.target.value)} />
            </label>

            <label className="config-field">
              <span>知识点标题</span>
              <input value={knowledgePointTitle} onChange={(event) => setKnowledgePointTitle(event.target.value)} />
            </label>

            <label className="config-field">
              <span>题库变体数</span>
              <input inputMode="numeric" type="number" value={variantCount} onChange={(event) => setVariantCount(event.target.value)} />
            </label>

            <label className="config-field config-field-full">
              <span>活动配置 JSON</span>
              <textarea rows={8} value={activityConfigJson} onChange={(event) => setActivityConfigJson(event.target.value)} />
            </label>
          </div>

          <div className="config-detail-actions">
            <button className="cta-button" disabled={isSaving} type="button" onClick={() => void handleSave()}>
              {isSaving ? '正在保存...' : '保存配置'}
            </button>
            {saveMessage ? <p className="success-feedback">{saveMessage}</p> : null}
            {errorMessage ? <p className="error-feedback">{errorMessage}</p> : null}
          </div>
        </article>

        <aside className="panel-card config-insight-card">
          <h2>配置健康检查</h2>
          <div className="config-health-notes" aria-label={`${detail.levelTitle} 配置健康说明`}>
            {detail.healthNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
          <div className="config-detail-summary">
            <p>知识点：{detail.knowledgePointTitle}</p>
            <p>变体覆盖：{detail.variantCount} 组</p>
            <p>素材主题：{detail.assetTheme}</p>
            <p>音频质量：{detail.audioQuality}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
