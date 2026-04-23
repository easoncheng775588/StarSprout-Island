import type { CSSProperties } from 'react';

export type MathVisualModel = (
  | {
      kind: 'grid';
      title: string;
      caption: string;
      rows: number;
      columns: number;
      filledCount: number;
      emoji?: string;
    }
  | {
      kind: 'number-line';
      title: string;
      caption: string;
      start: number;
      end: number;
      points: Array<{
        value: number;
        label: string;
        tone?: 'start' | 'end' | 'mid';
      }>;
      jumpLabel?: string;
    }
  | {
      kind: 'bar-model';
      title: string;
      caption: string;
      segments: Array<{
        label: string;
        value: number;
        tone?: 'known' | 'extra' | 'result';
      }>;
    }
  | {
      kind: 'fraction-bars';
      title: string;
      caption: string;
      bars: Array<{
        label: string;
        totalParts: number;
        filledParts: number;
        tone?: 'primary' | 'secondary';
      }>;
    }
);

interface MathModelBoardProps {
  model?: MathVisualModel;
}

export function MathModelBoard({ model }: MathModelBoardProps) {
  if (!model) {
    return null;
  }

  return (
    <div aria-label="数形结合模型" className={`math-model-board math-model-board-${model.kind}`}>
      <div className="math-model-header">
        <strong>{model.title}</strong>
        <span>{model.caption}</span>
      </div>

      {model.kind === 'grid' ? (
        <div
          className="math-model-grid"
          style={{
            '--math-grid-columns': model.columns
          } as CSSProperties}
        >
          {Array.from({ length: model.rows * model.columns }, (_, cellIndex) => {
            const isFilled = cellIndex < model.filledCount;

            return (
              <span
                aria-label={`${model.title} 格子 ${cellIndex + 1}`}
                className={`math-model-cell ${isFilled ? 'math-model-cell-filled' : ''}`}
                key={`${model.title}-${cellIndex + 1}`}
              >
                {isFilled ? model.emoji ?? '' : ''}
              </span>
            );
          })}
        </div>
      ) : null}

      {model.kind === 'number-line' ? (
        <div className="math-model-number-line">
          {model.jumpLabel ? <p>{model.jumpLabel}</p> : null}
          <div className="math-model-number-track">
            {Array.from({ length: model.end - model.start + 1 }, (_, tickIndex) => {
              const value = model.start + tickIndex;
              const point = model.points.find((item) => item.value === value);

              return (
                <span
                  aria-label={point ? `数轴点 ${value} ${point.label}` : `数轴点 ${value}`}
                  className={`math-model-number-point ${point ? 'math-model-number-point-active' : ''} ${point?.tone ? `math-model-number-point-${point.tone}` : ''}`}
                  key={value}
                >
                  {value}
                  {point ? <small>{point.label}</small> : null}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}

      {model.kind === 'bar-model' ? (
        <div className="math-model-bars">
          {model.segments.map((segment) => (
            <span
              aria-label={`线段 ${segment.label} ${segment.value}`}
              className={`math-model-bar-segment ${segment.tone ? `math-model-bar-segment-${segment.tone}` : ''}`}
              key={segment.label}
              style={{ '--math-bar-flex': segment.value } as CSSProperties}
            >
              <strong>{segment.label}</strong>
              <small>{segment.value}</small>
            </span>
          ))}
        </div>
      ) : null}

      {model.kind === 'fraction-bars' ? (
        <div className="math-model-fraction-list">
          {model.bars.map((bar) => (
            <div className="math-model-fraction-row" key={bar.label}>
              <span>{bar.label}</span>
              <div className="math-model-fraction-parts">
                {Array.from({ length: bar.totalParts }, (_, partIndex) => (
                  <span
                    aria-label={`${bar.label} 分数条 ${partIndex + 1}`}
                    className={`math-model-fraction-part ${partIndex < bar.filledParts ? 'math-model-fraction-part-filled' : ''} ${bar.tone ? `math-model-fraction-part-${bar.tone}` : ''}`}
                    key={`${bar.label}-${partIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
