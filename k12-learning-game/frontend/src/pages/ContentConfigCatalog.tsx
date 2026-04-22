import { useEffect, useState } from 'react';
import { getContentConfigCatalog, type ContentConfigCatalogData } from '../api';
import { PageTopBar } from '../components/PageTopBar';
import { useSession } from '../session';

interface ContentConfigCatalogProps {
  data?: ContentConfigCatalogData;
}

export function ContentConfigCatalog({ data }: ContentConfigCatalogProps) {
  const [catalog, setCatalog] = useState<ContentConfigCatalogData | null>(data ?? null);
  const { session } = useSession();

  useEffect(() => {
    if (data) {
      return;
    }

    getContentConfigCatalog().then(setCatalog);
  }, [data, session?.childProfileId]);

  if (!catalog) {
    return <main className="screen"><p>正在读取题库配置...</p></main>;
  }

  return (
    <main className="screen screen-parent screen-engagement">
      <PageTopBar backLabel="返回首页" backTo="/" />

      <section className="map-header engagement-hero config-hero">
        <p className="eyebrow">内容运营</p>
        <h1>题库配置中心</h1>
        <p>这里先展示已经下沉到后端的玩法配置，后续可以继续演进为完整 CMS。</p>
        <div className="engagement-stat-row">
          <span>已配置 {catalog.configuredLevelCount} 个后端玩法关卡</span>
          <span>累计 {catalog.totalVariantCount} 组题库变体</span>
          <span>配置覆盖率 {catalog.configCoveragePercent}%</span>
          <span>健康 {catalog.healthyLevelCount} 个</span>
          <span>需补齐 {catalog.warningLevelCount} 个</span>
        </div>
      </section>

      <section className="config-catalog-grid">
        {catalog.items.map((item) => (
          <article className="config-catalog-card" key={`${item.levelCode}-${item.knowledgePointCode}`}>
            <div className="config-card-topline">
              <span className="engagement-pill">{item.subjectTitle}</span>
              <span className={`config-health-pill config-health-pill-${item.healthStatus}`}>
                状态：{item.healthStatus === 'healthy' ? '健康' : '需补齐'}
              </span>
            </div>
            <h2>{item.levelTitle}</h2>
            <p>{item.knowledgePointTitle}</p>
            <div className="config-meta-row">
              <span>{item.variantCount} 组变体</span>
              <span>素材：{item.assetTheme}</span>
              <span>音频：{item.audioQuality}</span>
              <span>来源：{item.configSource}</span>
            </div>
            <div className="config-health-notes" aria-label={`${item.levelTitle} 配置健康说明`}>
              {item.healthNotes.map((note) => (
                <span key={note}>{note}</span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
